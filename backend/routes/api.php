<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TeacherClassroomController;

// routes/api.php
Route::get('/teachers/dasboard', [TeacherClassroomController::class, 'getDashboard']);

Route::get('/teachers/classroom', [TeacherClassroomController::class, 'getQuizzesWithResultCount']);

Route::get('/teachers/classroom/quiz', [TeacherClassroomController::class, 'getQuizResultsWithScores']);