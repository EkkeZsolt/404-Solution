<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\User;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Student;
use App\Models\Result;
use App\Models\DetailedResult;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Rules\QuestionBelongsToQuiz;

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
            'classrooms' => $classrooms,
        ]);
    }

    public function getQuizzesWithResultCount(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => ['required', 'integer', 'exists:classrooms,id'],
        ]);

        $classroom = Classroom::findOrFail($validated['classroom_id']);
        $studentId = auth()->id();

        // Get quizzes for this classroom
        $quizzes = $classroom->quizzes;

        // Map quizzes to include student result info
        $quizResults = $quizzes->map(function ($quiz) use ($studentId) {
            $result = Result::with('detailedResults')
                ->where('quiz_id', $quiz->id)
                ->where('student_id', $studentId)
                ->first();

            $score = null;

            if ($result) {
                $score = 0;
                $questions = $quiz->questions; // Assumes relationship exists

                foreach ($questions as $question) {
                    $userRes = $result->detailedResults
                        ->where('question_id', $question->id)
                        ->first();

                    if ($userRes) {
                        $correct = $question->correct_answers;
                        if (is_string($correct)) {
                            $correct = json_decode($correct, true);
                        }

                        $given = $userRes->answers;
                        if (is_string($given)) {
                            $given = json_decode($given, true);
                        }

                        if (!is_array($correct))
                            $correct = [];
                        if (!is_array($given))
                            $given = [];

                        sort($correct);
                        sort($given);

                        if ($correct == $given) {
                            $score++;
                        }
                    }
                }
            }

            return [
                'id' => $quiz->id,
                'name' => $quiz->name,
                'score' => $score,
            ];
        });

        return response()->json([
            'id' => $classroom->id,
            'name' => $classroom->name,
            'code' => $classroom->classroom_code,
            'quizResults' => $quizResults
        ]);
    }

    public function getQuiz(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => ['required', 'integer', 'exists:quizzes,id'],
        ]);

        $quiz = Quiz::findOrFail($validated['quiz_id']);
        $questionsRaw = $quiz->questions()->get();

        $questions = $questionsRaw->map(function ($q) {
            $correctKeys = is_string($q->correct_answers)
                ? json_decode($q->correct_answers, true)
                : $q->correct_answers;

            $mapping = [
                'answer_1' => 0,
                'answer_2' => 1,
                'answer_3' => 2,
                'answer_4' => 3,
            ];

            $correctIndices = array_map(function ($key) use ($mapping) {
                return $mapping[$key] ?? -1;
            }, $correctKeys ?? []);

            return [
                'id' => $q->id,
                'text' => $q->question_text,
                'options' => [
                    $q->answer_1,
                    $q->answer_2,
                    $q->answer_3,
                    $q->answer_4,
                ],
                'correct_indices' => $correctIndices,
                'correct_count' => count($correctIndices),
            ];
        });

        return response()->json([
            'status' => 'success',
            'questions' => $questions,
            'count' => $questions->count(),
            'classroom_id' => $quiz->classroom_id,
        ], 200);
    }

    public function postUploadResolute(Request $request)
    {
        // 1. Validation
        try {
            $validated = $request->validate([
                'quiz_id' => ['required', 'integer', 'exists:quizzes,id'],
                // student_id removed
                'answers' => ['required', 'array', 'min:1'],
                'answers.*.question_id' => [
                    'required',
                    'integer',
                    new QuestionBelongsToQuiz($request->input('quiz_id')),
                ],
                'answers.*.answers' => ['required', 'array'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // 2. Execution with Error Handling
        try {
            return DB::transaction(function () use ($validated) {
                // Check if student already submitted? (Optional future step)

                $studentId = auth()->id();

                $result = Result::create([
                    'quiz_id' => $validated['quiz_id'],
                    'student_id' => $studentId,
                ]);

                $detailedRows = array_map(fn($item) => [
                    'result_id' => $result->id,
                    'question_id' => $item['question_id'],
                    'answers' => json_encode($item['answers']),
                ], $validated['answers']);

                DetailedResult::insert($detailedRows);

                return response()->json([
                    'status' => 'success',
                    'result_id' => $result->id,
                    'message' => 'Quiz result stored successfully.',
                ], 201);
            });
        } catch (\Exception $e) {
            // Log the error for internal debugging
            \Illuminate\Support\Facades\Log::error('Quiz Upload Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            // Return user-friendly (but informative) error
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while saving the quiz.',
                'debug_error' => $e->getMessage(), // Only for debugging!
            ], 500);
        }
    }

    public function postJoinClassroom(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'classroom_code' => ['required', 'string', 'exists:classrooms,classroom_code'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $code = $request->input('classroom_code');
        $studentId = auth()->id();

        $classroom = Classroom::where('classroom_code', $code)->firstOrFail();

        // Check if already joined
        $exists = Student::where('classroom_id', $classroom->id)
            ->where('id_student', $studentId)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Student is already joined to this classroom.',
            ], 409); // Conflict
        }

        Student::create([
            'classroom_id' => $classroom->id,
            'id_student' => $studentId,
        ]);

        return response()->json([
            'message' => 'Successfully joined the classroom.',
        ], 201);
    }
}
