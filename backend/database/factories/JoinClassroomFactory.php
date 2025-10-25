<?php

namespace Database\Factories;

use App\Models\JoinClassroom;
use Illuminate\Database\Eloquent\Factories\Factory;

class JoinClassroomFactory extends Factory
{
    protected $model = JoinClassroom::class;

    public function definition()
    {
        return [
            'classroom_code' => \App\Models\Classroom::factory()->create()->classroom_code,
            'student_id'     => \App\Models\Student::factory(),
        ];
    }
}
