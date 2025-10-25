<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\Classroom;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition()
{
    return [
        'id_student'           => $this->faker->unique()->numberBetween(1, 9999), // or whatever logic you need
        'classroom_id' => Classroom::inRandomOrder()->first()?->id,
    ];
}
}
