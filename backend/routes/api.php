<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TeacherClassroomController;
use App\Http\Controllers\AuthController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware(['auth:sanctum', 'role:tanar'])
    ->prefix('teacher')
    ->group(function () {
        Route::get('/dasboard', [TeacherClassroomController::class, 'getDashboard']);
        Route::get('/classroom', [TeacherClassroomController::class, 'getQuizzesWithResultCount']);
        Route::get('/classroom/quiz', [TeacherClassroomController::class, 'getQuizResultsWithScores']);
    });
