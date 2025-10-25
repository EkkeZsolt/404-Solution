<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Classroom extends Model
{
    protected $table = 'classrooms';

    /** @var array<string> */
    protected $fillable = [
        'owner_id',
        'name',
        'visibility',      // 'public' or 'private'
        'classroom_code',
    ];

    /* Relationships ----------------------------------------------------- */

    public function owner(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'owner_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }
}
