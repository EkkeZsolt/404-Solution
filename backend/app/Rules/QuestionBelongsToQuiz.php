<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\Question;

class QuestionBelongsToQuiz implements Rule
{
    protected int $quizId;

    public function __construct(int $quizId)
    {
        $this->quizId = $quizId;
    }

    public function passes($attribute, $value): bool
    {
        return Question::where('id', $value)
            ->where('quiz_id', $this->quizId)
            ->exists();
    }

    public function message(): string
    {
        return 'The selected question does not belong to the specified quiz.';
    }
}
