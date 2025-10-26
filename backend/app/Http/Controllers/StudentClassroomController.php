<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\User;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class StudentClassroomController extends Controller
{
    public function getDashboard(Request $request)
{
    $studentId = auth()->id();

    $classrooms = DB::select(
        'SELECT c.id, c.name
         FROM classrooms AS c
         JOIN students AS s ON c.id = s.classroom_id
         WHERE s.id_student = :sid',
        ['sid' => $studentId]
    );

    return response()->json([
        'id_student' => $studentId,
        'classrooms' => $classrooms,   // stdClass objektumok listája
    ]);
}



    function getQuizzesWithResultCount(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => ['required', 'integer', 'exists:classrooms,id'],
        ]);

        $classroom = Classroom::findOrFail($validated['classroom_id']);

        return $classroom->quizzes()
            ->get();
    }

    function getQuiz(Request $request)
    {
        // ------------------------------------------------------------------
        // 1️⃣ Validate the incoming request
        // ------------------------------------------------------------------
        $validated = $request->validate([
            'quiz_id' => ['required', 'integer', 'exists:quizzes,id'],
        ]);

        // ------------------------------------------------------------------
        // 2️⃣ Retrieve the quiz (Eloquent will throw a 404 if not found)
        // ------------------------------------------------------------------
        /** @var \App\Models\Quiz $quiz */
        $quiz = Quiz::findOrFail($validated['quiz_id']);

        // ------------------------------------------------------------------
        // 3️⃣ Load all related questions
        // ------------------------------------------------------------------
        // We eager‑load the relationship to avoid N+1 queries.
        // If you need only a subset of columns, use ->select(...)
        $questions = $quiz->questions()->get();

        // ------------------------------------------------------------------
        // 4️⃣ Return a JSON response (Laravel will automatically convert
        //    Eloquent collections to JSON)
        // ------------------------------------------------------------------
        return response()->json([
            'status'   => 'success',
            'data'     => $questions,
            'count'    => $questions->count(),
        ], 200);
    }

    public function postCreateClassroom(Request $request)
    {
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

        $data = [
            'owner_id'      => auth()->id(),
            'name'          => $request->input('name'),
            'visibility'    => $request->input('visibility'),
            'classroom_code' => $this->generateClassroomCode(),
        ];

        $classroom = Classroom::create($data);

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

    private function generateClassroomCode(): string
    {
        do {
            $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        } while (Classroom::where('classroom_code', $code)->exists());

        return $code;
    }

    public function postCreateQuizWithQuestions(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'classroom_id' => ['required', 'integer', Rule::exists('classrooms', 'id')],
            'name'         => ['required', 'string', 'max:255'],
            'allow_back'   => ['sometimes', 'boolean'],

            'questions'          => ['required', 'array', 'min:1'],
            'questions.*.question_text'  => ['required', 'string'],

            'questions.*.answer_1'       => ['required', 'string'],
            'questions.*.answer_2'       => ['required', 'string'],
            'questions.*.answer_3'       => ['required', 'string'],
            'questions.*.answer_4'       => ['required', 'string'],

            'questions.*.max_points'     => ['required', 'integer', 'min:1'],

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

        $classroom = Classroom::findOrFail($request->input('classroom_id'));

        if ($classroom->owner_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not allowed to create a quiz in this classroom.',
            ], 403);
        }

        $quiz = Quiz::create([
            'classroom_id' => $request->input('classroom_id'),
            'name'         => $request->input('name'),
            'allow_back'   => $request->boolean('allow_back') ? 1 : 0,
        ]);

        $questionsData = array_map(function ($q) use ($quiz) {
            return [
                'quiz_id'          => $quiz->id,
                'question_text'    => $q['question_text'],
                'answer_1'         => $q['answer_1'],
                'answer_2'         => $q['answer_2'],
                'answer_3'         => $q['answer_3'],
                'answer_4'         => $q['answer_4'],
                'max_points'       => $q['max_points'],
                'correct_answers'  => json_encode($q['correct_answers']),
            ];
        }, $request->input('questions'));

        Question::insert($questionsData);

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
                        'correct_answers' => $q->correct_answers,
                    ];
                }),
            ],
        ], 201);
    }

    public function postUpdateQuizWithQuestions(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'quiz_id'       => ['required', 'integer', Rule::exists('quizzes', 'id')],
            'classroom_id'  => ['required', 'integer', Rule::exists('classrooms', 'id')],

            'name'          => ['required', 'string', 'max:255'],
            'allow_back'    => ['sometimes', 'boolean'],

            'questions'          => ['required', 'array', 'min:1'],
            'questions.*.id'     => ['required', 'integer', Rule::exists('questions', 'id')],
            'questions.*.question_text'  => ['required', 'string'],

            'questions.*.answer_1'       => ['required', 'string'],
            'questions.*.answer_2'       => ['required', 'string'],
            'questions.*.answer_3'       => ['required', 'string'],
            'questions.*.answer_4'       => ['required', 'string'],

            'questions.*.max_points'     => ['required', 'integer', 'min:1'],

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

        $quiz = Quiz::with('questions')->findOrFail($request->input('quiz_id'));

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

        $quiz->update([
            'name'       => $request->input('name'),
            'allow_back' => $request->boolean('allow_back') ? 1 : 0,
        ]);

        foreach ($request->input('questions') as $qData) {
            $question = $quiz->questions()->where('id', $qData['id'])->firstOrFail();

            $question->update([
                'question_text'   => $qData['question_text'],
                'answer_1'        => $qData['answer_1'],
                'answer_2'        => $qData['answer_2'],
                'answer_3'        => $qData['answer_3'],
                'answer_4'        => $qData['answer_4'],
                'max_points'      => $qData['max_points'],
                'correct_answers' => json_encode($qData['correct_answers']),
            ]);
        }

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
                        'correct_answers' => $q->correct_answers,
                    ];
                }),
            ],
        ], 200);
    }

    public function editQuiz(Request $request)
    {
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

        $quiz = Quiz::with('classroom')
            ->where('id', $request->input('quiz_id'))
            ->firstOrFail();

        if ($quiz->classroom_id !== (int)$request->input('classroom_id')) {
            return response()->json([
                'message' => 'The provided classroom does not own this quiz.',
            ], 400);
        }

        if ($quiz->classroom->owner_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not allowed to view this quiz.',
            ], 403);
        }

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
                        'correct_answers' => $q->correct_answers,
                    ];
                }),
            ],
        ]);
    }
}
