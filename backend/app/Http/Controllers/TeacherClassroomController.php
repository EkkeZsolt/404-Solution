<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TeacherClassroomController extends Controller
{
    
    public function getDashboard(Request $request)
    {

        $validated = $request->validate([
            'teacher_id' => ['required', 'integer', 'exists:teachers,id'],
        ]);


        // Load the teacher (or fail with 404)
        $teacher = Teacher::findOrFail($validated['teacher_id']);

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
            'classroom_code'=> $request->$this->generateClassroomCode(),
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

}
