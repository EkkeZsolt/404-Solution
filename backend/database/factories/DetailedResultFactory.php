<?php

namespace Database\Factories;

use App\Models\DetailedResult;
use Illuminate\Database\Eloquent\Factories\Factory;

class DetailedResultFactory extends Factory
{
    protected $model = DetailedResult::class;

    public function definition()
    {
        $correctIndexes = $this->faker->randomElements([1,2,3,4], rand(1,4));
        // Random answers (array of strings)
        return [
            'result_id'   => \App\Models\Result::factory(),
            'question_id' => \App\Models\Question::factory(),
            'answers'     => array_map(fn($i) => "answer_$i", $correctIndexes),
        ];
    }
}
