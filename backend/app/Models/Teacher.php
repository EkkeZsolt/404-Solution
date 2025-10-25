<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Teacher extends Model
{
    use HasFactory;
     public $timestamps = false;
    protected $table = 'teachers';

    /** @var array<string> */
    protected $fillable = [
         'classroom_id',
         'id_teacher',
         'id'
    ];

    /* Relationships ----------------------------------------------------- */

    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class, 'owner_id');
    }
}
