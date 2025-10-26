<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Classroom extends Model
{
    use HasFactory;
    public $timestamps = false;
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
        return $this->belongsTo(User::class, 'owner_id');
    }
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function students(): BelongsToMany
{
    return $this->belongsToMany(User::class, 'students', 'classroom_id', 'id_student')
                ->where('role', 'diak');   // csak diákok
}

    public function students2()
    {
        return $this->belongsToMany(Student::class, 'students')
                    ->withPivot('id_student', 'classroom_id');
    }


    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }
}
