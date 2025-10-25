<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Teacher;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Result;
use App\Models\DetailedResult;

class AllDataSeeder extends Seeder
{
    public function run()
    {
        // 1. Tanárok (10 tanár)
        Teacher::factory()
            ->count(10)                     // 10 tanár
            ->has(
                Classroom::factory()      // minden tanárhoz több osztály
                    ->count(5)                 // 5 osztály/tanár
                    ->public()                 // állapot: public
                    ->has(Student::factory()->count(15))   // 15 diák/osztályonként
            )
            ->create()
            ->each(function ($teacher) {
                // 2. Quiz-ek és kérdések minden osztálynak
                foreach ($teacher->classrooms as $classroom) {
                    $classroom->owner_id = $teacher->id;
                    $classroom->save();
                    // 3. Quiz (1–3 quiz per osztály)
                    $quizCount = rand(1, 3);
                    for ($i = 0; $i < $quizCount; $i++) {
                        $quiz = Quiz::factory()
                            ->for($classroom)
                            ->create();

                        // 4. Kérdések (5–10 kérdés/quiz)
                        Question::factory()
                            ->count(rand(5, 10))
                            ->for($quiz)
                            ->create();
                    }

                    // 5. Result + DetailedResult
                    // minden diák próbálkozik a quiz-ekkel
                    foreach ($classroom->students as $student) {
                        foreach ($classroom->quizzes as $quiz) {

                            // 1. Result
                            $result = Result::factory()
                                ->for($quiz)
                                ->for($student)
                                ->create();

                            // 2. DetailedResults – one per question (pick a random subset)
                            $questions = $quiz->questions()->inRandomOrder()->take(rand(3, 7))->get();

                            foreach ($questions as $question) {
                                DetailedResult::factory()
                                    ->for($result)          // sets result_id
                                    ->state(['question_id' => $question->id])   // manual FK
                                    ->create();
                            }
                        }
                    }
                }
            });

        $this->command->info('✅ All data seeded! (≈ ' . Teacher::count() . ' teachers, ' .
            Classroom::count() . ' classrooms, ' .
            Student::count() . ' students, ' .
            Quiz::count() . ' quizzes, ' .
            Question::count() . ' questions, ' .
            Result::count() . ' results)');
    }
}
