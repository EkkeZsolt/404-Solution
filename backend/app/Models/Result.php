<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Result extends Model
{
    protected $table = 'results';

    /** @var array<string> */
    protected $fillable = [
        'quiz_id',
        'student_id',
    ];

    /* Relationships ----------------------------------------------------- */

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function detailedResults(): HasMany
    {
        return $this->hasMany(DetailedResult::class, 'result_id');
    }
}
