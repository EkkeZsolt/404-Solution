<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherClassroomController extends Controller
{
    /**
     * Return all classrooms that belong to a teacher **plus** the number of students in each.
     *
     * @param  int  $teacherId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(int $teacherId)
    {
        // Load the teacher (or fail with 404)
        $teacher = Teacher::findOrFail($teacherId);

        // Get classrooms + student counts
        $classrooms = $teacher->classrooms()
                               ->withCount('students')
                               ->get(['id', 'name']);   // pick only the columns you need

        return response()->json([
            'teacher_id'  => $teacher->id,
            'classrooms'  => $classrooms,          // each item has a `student_count` field
        ]);
    }
}
