<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Result extends Model
{
    use HasFactory;
     public $timestamps = false;
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
        // Point to the User model, not a non‑existent Student model
        return $this->belongsTo(User::class, 'student_id');
    }

    public function detailedResults(): HasMany
    {
        return $this->hasMany(DetailedResult::class, 'result_id');
    }
}
