<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    protected $table = 'questions';

    /** @var array<string> */
    protected $fillable = [
        'quiz_id',
        'question_text',
        'answer_1',
        'answer_2',
        'answer_3',
        'answer_4',
        'max_points',
        'correct_answers',   // JSON column
    ];

    /* Casts ------------------------------------------------------------- */

    protected $casts = [
        'correct_answers' => 'array',
    ];

    /* Relationships ----------------------------------------------------- */

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function detailedResults(): HasMany
    {
        return $this->hasMany(DetailedResult::class, 'question_id');
    }
}
