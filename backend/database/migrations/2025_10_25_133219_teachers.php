<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classroom_id')
                  ->nullable()
                  ->constrained('classrooms')
                  ->onDelete('set null');
        });

        DB::statement('PRAGMA foreign_keys = ON;');
    }

    public function down()
    {
        Schema::dropIfExists('teachers');
    }
};
