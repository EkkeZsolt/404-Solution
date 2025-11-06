<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JoinClassroom extends Model
{
    use HasFactory;
     public $timestamps = false;
    protected $table = 'join_classroom';

    /** @var array<string> */
    protected $fillable = [
        'classroom_code',
        'student_id',
    ];

    /* No primary key – Laravel treats the whole row as a pivot. */

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function classroom(): BelongsTo
    {
        // Join on the code instead of an id
        return $this->belongsTo(Classroom::class, 'classroom_code', 'classroom_code');
    }
}
