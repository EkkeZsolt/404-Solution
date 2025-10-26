<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Classroom;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Result;
use App\Models\DetailedResult;
use Illuminate\Database\Seeder;

class AllDataSeeder extends Seeder
{
    public function run(): void
    {
        // ------------------------------------------------------------------
        // 1️⃣ Create 10 teachers (users with role = 'tanar')
        // ------------------------------------------------------------------
        User::factory()
            ->count(10)
            ->state(['role' => 'tanar'])
            ->create()
            ->each(function (User $teacher) {

                /* ------------------------------------------------------------------
                 * 2️⃣ Create a random number of classrooms for this teacher
                 * ------------------------------------------------------------------ */
                $classrooms = Classroom::factory()
                    ->count(rand(3, 7))          // 3–7 per teacher
                    ->for($teacher, 'owner')     // owner_id → users.id
                    ->create();

                /* ------------------------------------------------------------------
                 * 3️⃣ For each classroom create a random number of students (20‑30)
                 * ------------------------------------------------------------------ */
                foreach ($classrooms as $room) {
                    User::factory()
                        ->count(rand(20, 30))
                        ->state(['role' => 'diak'])
                        ->create()
                        ->each(fn (User $student) => $room->students()->attach($student));
                }

                /* ------------------------------------------------------------------
                 * 4️⃣ Create quizzes & questions for every classroom
                 * ------------------------------------------------------------------ */
                foreach ($classrooms as $classroom) {

                    // a) 1–3 quizzes per classroom
                    for ($i = 0; $i < rand(1, 3); $i++) {
                        $quiz = Quiz::factory()
                            ->for($classroom)
                            ->create();

                        // b) 5–10 questions per quiz
                        Question::factory()
                            ->count(rand(5, 10))
                            ->for($quiz)
                            ->create();
                    }

                    /* ------------------------------------------------------------------
                     * 5️⃣ Results & DetailedResults – every student attempts every quiz
                     * ------------------------------------------------------------------ */
                    $students = $classroom->students()->get();   // egy lekérdezés

                    foreach ($students as $student) {
                        foreach ($classroom->quizzes as $quiz) {

                            // 5.1 Result
                            $result = Result::factory()
                                ->for($quiz)
                                ->for($student, 'student')   // user_id → users.id
                                ->create();

                            // 5.2 DetailedResults – pick a random subset of questions
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

        // Quick summary
        $this->command->info('✅ All data seeded! (≈ '
            . User::where('role', 'tanar')->count() . ' teachers, '
            . Classroom::count() . ' classrooms, '
            . User::where('role', 'diak')->count() . ' students, '
            . Quiz::count() . ' quizzes, '
            . Question::count() . ' questions, '
            . Result::count() . ' results)');
    }
}
