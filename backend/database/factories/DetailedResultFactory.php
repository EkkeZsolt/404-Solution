<?php

namespace Database\Factories;

use App\Models\DetailedResult;
use Illuminate\Database\Eloquent\Factories\Factory;

class DetailedResultFactory extends Factory
{
    protected $model = DetailedResult::class;

    public function definition()
    {
        // Random answers (array of strings)
        return [
            'result_id'   => \App\Models\Result::factory(),
            'question_id' => \App\Models\Question::factory(),
            'answers'     => array_map(fn() => $this->faker->sentence(3), range(1, rand(1,4))),
        ];
    }
}
