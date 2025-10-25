<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    protected $table = 'teachers';

    /** @var array<string> */
    protected $fillable = [
         'classroom_id',
         'id'
    ];

    /* Relationships ----------------------------------------------------- */

    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class, 'owner_id');
    }
}
