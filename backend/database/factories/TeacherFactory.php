<?php

namespace Database\Factories;

use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Classroom;
use Illuminate\Support\Str;

class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    public function definition()
        {
    return [
        'id_teacher'           => $this->faker->unique()->numberBetween(1, 9999), // or whatever logic you need
        'classroom_id' => Classroom::inRandomOrder()->first()?->id,
    ];
        }
}
