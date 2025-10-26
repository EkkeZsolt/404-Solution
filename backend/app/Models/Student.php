<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    // app/Models/Student.php

    public function classrooms()
    {
        return $this->belongsToMany(
            Classroom::class,   // a célmodell
            'students',         // pivot tábla neve
            'id_student',       // helyi kulcs a pivotban
            'classroom_id'      // kapcsolódó kulcs a pivotban
        )->withPivot('id_student', 'classroom_id'); 
    }



    public function results(): HasMany
    {
        return $this->hasMany(Result::class);
    }
}
