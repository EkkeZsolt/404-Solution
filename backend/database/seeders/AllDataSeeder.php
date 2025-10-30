<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Classroom;
use App.Models\Quiz;
use App\Models\Question;
use App\Models\Result;
use App\Models\DetailedResult;
use Illuminate\Database\Seeder;

class AllDataSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()
            ->count(10)
            ->state(['role' => 'tanar'])
            ->create()
            ->each(function (User $teacher) {

                $classrooms = Classroom::factory()
                    ->count(rand(10, 15))
                    ->for($teacher, 'owner')
                    ->create();

                foreach ($classrooms as $room) {
                    User::factory()
                        ->count(rand(20, 30))
                        ->state(['role' => 'diak'])
                        ->create()
                        ->each(fn (User $student) => $room->students()->attach($student));
                }

                foreach ($classrooms as $classroom) {

                    for ($i = 0; $i < rand(5, 10); $i++) {
                        $quiz = Quiz::factory()
                            ->for($classroom)
                            ->create();

                        Question::factory()
                            ->count(rand(5, 10))
                            ->for($quiz)
                            ->create();
                    }

                    $students = $classroom->students()->get();

                    foreach ($students as $student) {
                        foreach ($classroom->quizzes as $quiz) {

                            $result = Result::factory()
                                ->for($quiz)
                                ->for($student, 'student')
                                ->create();

                            $questions = $quiz->questions()
                                ->inRandomOrder()
                                ->take(rand(3, 7))
                                ->get();

                            foreach ($questions as $question) {
                                DetailedResult::factory()
                                    ->for($result)
                                    ->state(['question_id' => $question->id])
                                    ->create();
                            }
                        }
                    }
                }
            });

        $this->command->info('✅ All data seeded! (≈ '
            . User::where('role', 'tanar')->count() . ' teachers, '
            . Classroom::count() . ' classrooms, '
            . User::where('role', 'diak')->count() . ' students, '
            . Quiz::count() . ' quizzes, '
            . Question::count() . ' questions, '
            . Result::count() . ' results)');
    }
}
