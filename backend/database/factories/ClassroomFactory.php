<?php

namespace Database\Factories;

use App\Models\Classroom;
use App\Models\User;          // <-- a User modellt használjuk
use Illuminate\Database\Eloquent\Factories\Factory;

class ClassroomFactory extends Factory
{
    protected $model = Classroom::class;

    public function definition()
    {
        return [
            'name'           => $this->faker->words(3, true),
            'visibility'     => $this->faker->randomElement(['public', 'private']),
            'classroom_code' => strtoupper($this->faker->bothify('??##??')),
        ];
    }

    // State for a public classroom
    public function public()
    {
        return $this->state(fn (array $attributes) => [
            'visibility' => 'public',
        ]);
    }
}
