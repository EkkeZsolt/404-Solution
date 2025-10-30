<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')
                  ->constrained('quizzes')
                  ->onDelete('cascade');
            $table->text('question_text');
            $table->string('answer_1');
            $table->string('answer_2');
            $table->string('answer_3');
            $table->string('answer_4');
            $table->tinyInteger('max_points')->default(1);
            $table->json('correct_answers');  
        });

        DB::statement('PRAGMA foreign_keys = ON;');
    }

    public function down()
    {
        Schema::dropIfExists('questions');
    }
};
