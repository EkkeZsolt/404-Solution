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

        return $classroom->quizzes()->get();
    }

    public function getQuiz(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => ['required', 'integer', 'exists:quizzes,id'],
        ]);

        $quiz = Quiz::findOrFail($validated['quiz_id']);

        $questions = $quiz->questions()->get();

        return response()->json([
            'status'   => 'success',
            'data'     => $questions,
            'count'    => $questions->count(),
        ], 200);
    }

    public function postUploadResolute(Request $request)
    {
        $validated = $request->validate([
            'quiz_id'      => ['required', 'integer', 'exists:quizzes,id'],
            'student_id'   => ['required', 'integer', 'exists:users,id'],
            'answers'      => ['required', 'array', 'min:1'],
            'answers.*.question_id' => [
                'required',
                'integer',
                new QuestionBelongsToQuiz($request->input('quiz_id')),
            ],
            'answers.*.answers' => ['required', 'array'],
        ]);

        return DB::transaction(function () use ($validated) {
            $result = Result::create([
                'quiz_id'    => $validated['quiz_id'],
                'student_id' => $validated['student_id'],
            ]);

            $detailedRows = array_map(fn($item) => [
                'result_id'   => $result->id,
                'question_id' => $item['question_id'],
                'answers'     => json_encode($item['answers']),
            ], $validated['answers']);

            DetailedResult::insert($detailedRows);

            return response()->json([
                'status'    => 'success',
                'result_id' => $result->id,
                'message'   => 'Quiz result stored successfully.',
            ], 201);
        });
    }
}
