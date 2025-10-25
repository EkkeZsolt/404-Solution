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
}
