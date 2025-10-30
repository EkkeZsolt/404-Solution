<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classroom_id')
                  ->constrained('classrooms')
                  ->onDelete('cascade');
            $table->string('name');
            $table->tinyInteger('allow_back')->default(0);
        });

        DB::statement('PRAGMA foreign_keys = ON;');
    }

    public function down()
    {
        Schema::dropIfExists('quizzes');
    }
};
