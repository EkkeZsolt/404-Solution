<?php

namespace Database\Factories;

use App\Models\Result;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResultFactory extends Factory
{
    protected $model = Result::class;

    public function definition()
    {
        return [
            'quiz_id'     => \App\Models\Quiz::factory(),
            'student_id'  => \App\Models\Student::factory(),
        ];
    }
}
