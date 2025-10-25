<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailedResult extends Model
{
    protected $table = 'detailed_results';

    /** @var array<string> */
    protected $fillable = [
        'result_id',
        'question_id',
        'answers',          // JSON column
    ];

    /* Casts ------------------------------------------------------------- */

    protected $casts = [
        'answers' => 'array',
    ];

    /* Relationships ----------------------------------------------------- */

    public function result(): BelongsTo
    {
        return $this->belongsTo(Result::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
