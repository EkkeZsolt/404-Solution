<?php

namespace Database\Factories;

use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition()
    {
        // Randomly pick 1‑4 correct answers
        $correctIndexes = $this->faker->randomElements([1,2,3,4], rand(1,4));

        return [
            'quiz_id'          => \App\Models\Quiz::factory(),
            'question_text'    => $this->faker->sentence(6),
            'answer_1'         => $this->faker->sentence(4),
            'answer_2'         => $this->faker->sentence(4),
            'answer_3'         => $this->faker->sentence(4),
            'answer_4'         => $this->faker->sentence(4),
            'max_points'       => rand(1, 10),
            'correct_answers'  => array_map(fn($i) => "answer_$i", $correctIndexes),
        ];
    }
}
