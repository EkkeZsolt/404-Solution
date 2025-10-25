<?php

namespace Database\Seeders;

use App\Models\Teacher;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Result;
use App\Models\DetailedResult;
use Illuminate\Database\Seeder;

class AllDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1️⃣ Create 10 teachers
        Teacher::factory()
            ->count(10)
            ->create()
            ->each(function (Teacher $teacher) {

                /* ------------------------------------------------------------------
                 * 2️⃣ Create a random number of classrooms for this teacher
                 * ------------------------------------------------------------------ */
                $classrooms = Classroom::factory()
                    ->count(rand(3, 7))          // 3–7 per teacher
                    ->for($teacher)
                    ->public()                   // state: public
                    ->create();

                /* ------------------------------------------------------------------
                 * 3️⃣ For each classroom create a random number of students (20‑30)
                 * ------------------------------------------------------------------ */
                foreach ($classrooms as $room) {
                    Student::factory()
                        ->count(rand(20, 30))
                        ->for($room)
                        ->create();
                }

                /* ------------------------------------------------------------------
                 * 4️⃣ Create quizzes & questions for every classroom
                 * ------------------------------------------------------------------ */
                foreach ($classrooms as $classroom) {

                    // make sure the owner_id is set (teacher owns the class)
                    $classroom->owner_id = $teacher->id;
                    $classroom->save();

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
                    // Load students once to avoid N+1 queries
                    $students = $classroom->students()->get();

                    foreach ($students as $student) {
                        foreach ($classroom->quizzes as $quiz) {

                            // 5.1 Result
                            $result = Result::factory()
                                ->for($quiz)
                                ->for($student)
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
            . Teacher::count() . ' teachers, '
            . Classroom::count() . ' classrooms, '
            . Student::count() . ' students, '
            . Quiz::count() . ' quizzes, '
            . Question::count() . ' questions, '
            . Result::count() . ' results)');
    }
}
