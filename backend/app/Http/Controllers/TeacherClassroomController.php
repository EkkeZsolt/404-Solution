<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\User;
use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TeacherClassroomController extends Controller
{

    public function getDashboard(Request $request)
    {
        // Load the teacher (or fail with 404)
        $teacher = User::findOrFail(auth()->id());

        // Get classrooms + student counts
        $classrooms = $teacher->classrooms()
            ->withCount('students')
            ->get(['id', 'name']);   // pick only the columns you need

        return response()->json([
            'teacher_id'  => $teacher->id,
            'classrooms'  => $classrooms,          // each item has a `student_count` field
        ]);
    }



    function getQuizzesWithResultCount(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => ['required', 'integer', 'exists:classrooms,id'],
        ]);

        $classroom = Classroom::findOrFail($validated['classroom_id']);

        // `withCount('results')` adds a `results_count` attribute to each Quiz
        return $classroom->quizzes()
            ->withCount('results')
            ->get();
    }



    function getQuizResultsWithScores(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => ['required', 'integer', 'exists:quizzes,id'],
        ]);
        /** @var \App\Models\Quiz $quiz */

        $quiz = \App\Models\Quiz::findOrFail($validated['quiz_id']);
        /* ------------------------------------------------------------------
       1. Grab all results for this quiz (one row per student)
       2. For each result, load the detailed answers and the question data
       3. Compute the score
       ------------------------------------------------------------------ */

        // Step 1 – get all Result rows for the quiz
        $results = \App\Models\Result::where('quiz_id', $quiz->id)->get();

        // Prepare a collection that will hold the final output
        $output = collect();

        foreach ($results as $result) {
            // 2. Load detailed answers + question data in one go (eager‑load)
            $detailed = \App\Models\DetailedResult::where('result_id', $result->id)
                ->with(['question' => function ($q) {
                    $q->select(
                        'id',
                        'question_text',
                        'max_points',
                        'correct_answers'
                    );
                }])
                ->get();

            $totalScore = 0.0;
            $details    = [];

            foreach ($detailed as $dr) {
                /** @var \App\Models\Question $q */
                $q          = $dr->question;          // eager‑loaded
                $answers    = $dr->answers ?? [];      // array (cast)
                $correct    = $q->correct_answers ?? [];

                if (empty($correct)) {
                    continue;
                }

                $weight           = $q->max_points / count($correct);
                $selectedCorrect  = count(array_intersect($answers, $correct));
                $wrongAnswers     = count(array_diff($answers, $correct));

                // Score calculation
                $questionScore = ($selectedCorrect * $weight) - ($wrongAnswers * $weight);

                // Clamp to zero – no negative points
                if ($questionScore < 0) {
                    $questionScore = 0.0;
                }

                $totalScore += $questionScore;

                $details[] = [
                    'question_id'        => $q->id,
                    'question_text'      => $q->question_text,
                    'max_points'         => $q->max_points,
                    'correct_answers'    => $correct,
                    'student_answers'    => $answers,
                    'score_for_question' => round($questionScore, 2),
                ];
            }



            // Optional: fetch the student’s name
            $student = \App\Models\Student::find($result->student_id);

            $output->push([
                'student_id'   => $result->student_id,
                'total_score'  => round($totalScore, 2),
                'details'      => $details,
            ]);
        }

        return response()->json([
            'quiz_id'   => $quiz->id,
            'quiz_name' => $quiz->name,
            'results'   => $output,
        ]);
    }


    public function postCreateClassroom(Request $request)
    {
        // 1️⃣ Validate the incoming data
        $validator = Validator::make($request->all(), [
            'name'          => ['required', 'string', 'max:255'],
            'visibility'    => ['required', Rule::in(['public', 'private'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // 2️⃣ Prepare the data array
        $data = [
            'owner_id'      => auth()->id(),          // assuming teacher is authenticated
            'name'          => $request->input('name'),
            'visibility'    => $request->input('visibility'),
            'classroom_code' => $this->generateClassroomCode(),
        ];

        // 3️⃣ Create the classroom
        $classroom = Classroom::create($data);

        // 4️⃣ Return a response (you can customize the shape)
        return response()->json([
            'message'   => 'Classroom created successfully',
            'classroom' => [
                'id'             => $classroom->id,
                'owner_id'       => $classroom->owner_id,
                'name'           => $classroom->name,
                'visibility'     => $classroom->visibility,
                'classroom_code' => $classroom->classroom_code,
            ],
        ], 201);
    }

    /**
     * Helper to generate a unique classroom code.
     */
    private function generateClassroomCode(): string
    {
        do {
            $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        } while (Classroom::where('classroom_code', $code)->exists());

        return $code;
    }

    public function postCreateQuizWithQuestions(Request $request)
    {
        /* ------------------------------------------------------------------
         * 1️⃣ Validate the incoming data (quiz + questions)
         * ------------------------------------------------------------------*/
        $validator = Validator::make($request->all(), [
            // Quiz fields
            'classroom_id' => ['required', 'integer', Rule::exists('classrooms', 'id')],
            'name'         => ['required', 'string', 'max:255'],
            'allow_back'   => ['sometimes', 'boolean'],

            // Questions array
            'questions'          => ['required', 'array', 'min:1'],
            'questions.*.question_text'  => ['required', 'string'],

            // All four answer fields are mandatory – no nulls allowed
            'questions.*.answer_1'       => ['required', 'string'],
            'questions.*.answer_2'       => ['required', 'string'],
            'questions.*.answer_3'       => ['required', 'string'],
            'questions.*.answer_4'       => ['required', 'string'],

            'questions.*.max_points'     => ['required', 'integer', 'min:1'],

            // correct_answers must be an array of the keys that exist in this question
            'questions.*.correct_answers' => [
                'required',
                'array',
                'min:1',
                function ($attribute, $value, $fail) {
                    $allowed = ['answer_1', 'answer_2', 'answer_3', 'answer_4'];
                    foreach ($value as $key) {
                        if (!in_array($key, $allowed)) {
                            return $fail("Each correct answer must be one of: " . implode(', ', $allowed));
                        }
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        /* ------------------------------------------------------------------
         * 2️⃣ Verify classroom ownership
         * ------------------------------------------------------------------*/
        $classroom = Classroom::findOrFail($request->input('classroom_id'));

        if ($classroom->owner_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not allowed to create a quiz in this classroom.',
            ], 403);
        }

        /* ------------------------------------------------------------------
         * 3️⃣ Create the quiz
         * ------------------------------------------------------------------*/
        $quiz = Quiz::create([
            'classroom_id' => $request->input('classroom_id'),
            'name'         => $request->input('name'),
            'allow_back'   => $request->boolean('allow_back') ? 1 : 0,
        ]);

        /* ------------------------------------------------------------------
 * 4️⃣ Prepare and bulk‑insert all questions
 * ------------------------------------------------------------------*/
        $questionsData = array_map(function ($q) use ($quiz) {
            return [
                'quiz_id'          => $quiz->id,
                'question_text'    => $q['question_text'],
                'answer_1'         => $q['answer_1'],
                'answer_2'         => $q['answer_2'],
                'answer_3'         => $q['answer_3'],
                'answer_4'         => $q['answer_4'],
                'max_points'       => $q['max_points'],

                // **Encode the array to JSON** – this is what SQLite expects
                'correct_answers'  => json_encode($q['correct_answers']),
            ];
        }, $request->input('questions'));

        Question::insert($questionsData);   // now works fine
        /* ------------------------------------------------------------------
         * 5️⃣ Load the quiz with its questions for the response
         * ------------------------------------------------------------------*/
        $quizWithQuestions = Quiz::with('questions')->findOrFail($quiz->id);

        return response()->json([
            'message' => 'Quiz and its questions created successfully',
            'quiz'    => [
                'id'           => $quizWithQuestions->id,
                'classroom_id' => $quizWithQuestions->classroom_id,
                'name'         => $quizWithQuestions->name,
                'allow_back'   => (int) $quizWithQuestions->allow_back,
                'questions'    => $quizWithQuestions->questions->map(function ($q) {
                    return [
                        'id'              => $q->id,
                        'question_text'   => $q->question_text,
                        'answer_1'        => $q->answer_1,
                        'answer_2'        => $q->answer_2,
                        'answer_3'        => $q->answer_3,
                        'answer_4'        => $q->answer_4,
                        'max_points'      => $q->max_points,
                        'correct_answers' => $q->correct_answers, // array of strings
                    ];
                }),
            ],
        ], 201);
    }

    public function postUpdateQuizWithQuestions(Request $request)
    {
        /* ---------- 1️⃣ Validate --------------------------------------- */
        $validator = Validator::make($request->all(), [
            // Identifiers – must exist and match
            'quiz_id'       => ['required', 'integer', Rule::exists('quizzes', 'id')],
            'classroom_id'  => ['required', 'integer', Rule::exists('classrooms', 'id')],

            // Quiz fields
            'name'          => ['required', 'string', 'max:255'],
            'allow_back'    => ['sometimes', 'boolean'],

            // Questions array (must match the existing count)
            'questions'          => ['required', 'array', 'min:1'],
            'questions.*.id'     => ['required', 'integer', Rule::exists('questions', 'id')],
            'questions.*.question_text'  => ['required', 'string'],

            // All four answer fields are mandatory
            'questions.*.answer_1'       => ['required', 'string'],
            'questions.*.answer_2'       => ['required', 'string'],
            'questions.*.answer_3'       => ['required', 'string'],
            'questions.*.answer_4'       => ['required', 'string'],

            'questions.*.max_points'     => ['required', 'integer', 'min:1'],

            // correct_answers must be an array of the keys that exist in this question
            'questions.*.correct_answers' => [
                'required',
                'array',
                'min:1',
                function ($attribute, $value, $fail) {
                    $allowed = ['answer_1', 'answer_2', 'answer_3', 'answer_4'];
                    foreach ($value as $key) {
                        if (!in_array($key, $allowed)) {
                            return $fail("Each correct answer must be one of: " . implode(', ', $allowed));
                        }
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        /* ---------- 2️⃣ Load the quiz & check ownership ---------------- */
        $quiz = Quiz::with('questions')->findOrFail($request->input('quiz_id'));

        // Classroom must match and belong to the authenticated user
        if ($quiz->classroom_id !== (int)$request->input('classroom_id')) {
            return response()->json([
                'message' => 'The quiz does not belong to the specified classroom.',
            ], 400);
        }

        $classroom = Classroom::findOrFail($request->input('classroom_id'));
        if ($classroom->owner_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not allowed to update this quiz.',
            ], 403);
        }

        /* ---------- 3️⃣ Update the quiz -------------------------------- */
        $quiz->update([
            'name'       => $request->input('name'),
            'allow_back' => $request->boolean('allow_back') ? 1 : 0,
        ]);

        /* ---------- 4️⃣ Update each question --------------------------- */
        foreach ($request->input('questions') as $qData) {
            // Find the existing question that belongs to this quiz
            $question = $quiz->questions()->where('id', $qData['id'])->firstOrFail();

            $question->update([
                'question_text'   => $qData['question_text'],
                'answer_1'        => $qData['answer_1'],
                'answer_2'        => $qData['answer_2'],
                'answer_3'        => $qData['answer_3'],
                'answer_4'        => $qData['answer_4'],
                'max_points'      => $qData['max_points'],
                // encode the array to JSON for SQLite
                'correct_answers' => json_encode($qData['correct_answers']),
            ]);
        }

        /* ---------- 5️⃣ Return updated data ---------------------------- */
        $updatedQuiz = Quiz::with('questions')->findOrFail($quiz->id);

        return response()->json([
            'message' => 'Quiz and its questions updated successfully',
            'quiz'    => [
                'id'           => $updatedQuiz->id,
                'classroom_id' => $updatedQuiz->classroom_id,
                'name'         => $updatedQuiz->name,
                'allow_back'   => (int) $updatedQuiz->allow_back,
                'questions'    => $updatedQuiz->questions->map(function ($q) {
                    return [
                        'id'              => $q->id,
                        'question_text'   => $q->question_text,
                        'answer_1'        => $q->answer_1,
                        'answer_2'        => $q->answer_2,
                        'answer_3'        => $q->answer_3,
                        'answer_4'        => $q->answer_4,
                        'max_points'      => $q->max_points,
                        'correct_answers' => $q->correct_answers, // decoded array
                    ];
                }),
            ],
        ], 200);
    }


    /**
     * GET /quizzes/edit   (or POST/PUT – any verb that your client uses)
     *
     * The request body must contain:
     *  - quiz_id
     *  - classroom_id
     *
     * Returns the quiz data as JSON.
     */
    public function editQuiz(Request $request)
    {
        /* ---------- 1️⃣ Validate incoming JSON ------------------------ */
        $validator = Validator::make($request->all(), [
            'quiz_id'       => ['required', 'integer'],
            'classroom_id'  => ['required', 'integer'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        /* ---------- 2️⃣ Load the quiz --------------------------------- */
        $quiz = Quiz::with('classroom')
            ->where('id', $request->input('quiz_id'))
            ->firstOrFail();

        // Classroom id supplied in body must match the one that owns the quiz
        if ($quiz->classroom_id !== (int)$request->input('classroom_id')) {
            return response()->json([
                'message' => 'The provided classroom does not own this quiz.',
            ], 400);
        }

        // Ownership check – only the teacher who owns the classroom can edit
        if ($quiz->classroom->owner_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not allowed to view this quiz.',
            ], 403);
        }

        /* ---------- 3️⃣ Return JSON ----------------------------------- */
        return response()->json([
            'quiz' => [
                'id'           => $quiz->id,
                'classroom_id' => $quiz->classroom_id,
                'name'         => $quiz->name,
                'allow_back'   => (int) $quiz->allow_back,
                'questions'    => $quiz->questions->map(function ($q) {
                    return [
                        'id'              => $q->id,
                        'question_text'   => $q->question_text,
                        'answer_1'        => $q->answer_1,
                        'answer_2'        => $q->answer_2,
                        'answer_3'        => $q->answer_3,
                        'answer_4'        => $q->answer_4,
                        'max_points'      => $q->max_points,
                        // decoded array – already cast by the model
                        'correct_answers' => $q->correct_answers,
                    ];
                }),
            ],
        ]);
    }
}
