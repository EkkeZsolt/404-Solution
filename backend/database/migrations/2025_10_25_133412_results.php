<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
         Schema::create('results', function (Blueprint $table) {
            $table->id();

            // Quiz FK – ez rendben van
            $table->foreignId('quiz_id')
                  ->constrained()          // quizzes.id
                  ->onDelete('cascade');

            // Student FK – most a users.tábla
            $table->foreignId('student_id')
                  ->constrained('users')   // users.id
                  ->onDelete('cascade');
        });

        // Ha SQLite‑t használsz, engedélyezd a foreign key-ket
        DB::statement('PRAGMA foreign_keys = ON;');
    }

    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('results');
    }
};
