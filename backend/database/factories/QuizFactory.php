<?php

namespace Database\Factories;

use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    public function definition()
    {
        return [
            'classroom_id' => \App\Models\Classroom::factory(),
            'name'         => $this->faker->sentence(3),
            'allow_back'   => $this->faker->boolean(30), // 30% chance true
        ];
    }
}
