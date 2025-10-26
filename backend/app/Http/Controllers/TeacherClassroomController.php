<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Classroom;
use Illuminate\Http\Request;

class TeacherClassroomController extends Controller
{
    /**
     * Return all classrooms that belong to a teacher **plus** the number of students in each.
     *
     * @param  int  $teacherId
     * @return \Illuminate\Http\JsonResponse
     */
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


    /**
     * Return every quiz belonging to the given classroom together with
     * the number of students that have taken each quiz.
     *
     * @param  int|\App\Models\Classroom  $classroom   Classroom id or instance
     * @return \Illuminate\Support\Collection<int, \App\Models\Quiz>
     */
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


    /**
     * Return every student that has taken the given quiz together with his/her score.
     *
     * @param  int|\App\Models\Quiz  $quiz   Quiz id or instance
     * @return \Illuminate\Support\Collection<int, array{student_id:int, name:string|null, score:float}>
     */
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
}
