<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('joinclassroom', function (Blueprint $table) {
            $table->char('classroom_code', 8);
            $table->foreignId('student_id')
                  ->constrained('students')
                  ->onDelete('cascade');
            $table->primary(['classroom_code', 'student_id']);
        });

        DB::statement('PRAGMA foreign_keys = ON;');
    }

    public function down()
    {
        Schema::dropIfExists('joinclassroom');
    }
};