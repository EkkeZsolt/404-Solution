<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'students';

    /** @var array<string> */
    protected $fillable = [
        'id',
        'id_student',
        'classroom_id'
    ];

    /* Relationships ----------------------------------------------------- */

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(Result::class);
    }
}
