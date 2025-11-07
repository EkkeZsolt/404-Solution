<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TeacherClassroomController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentClassroomController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware(['auth:sanctum', 'role:tanar'])
    ->prefix('teacher')
    ->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/dasboard', [TeacherClassroomController::class, 'getDashboard']);
        Route::get('/classroom', [TeacherClassroomController::class, 'getQuizzesWithResultCount']);
        Route::get('/classroom/quiz', [TeacherClassroomController::class, 'getQuizResultsWithScores']);
        Route::post('/classroom/create', [TeacherClassroomController::class, 'postCreateClassroom']);
        Route::post('/classroom/quiz/create', [TeacherClassroomController::class, 'postCreateQuizWithQuestions']);
        Route::get('/classroom/quiz/edit', [TeacherClassroomController::class, 'editQuiz']);
        Route::put('/classroom/quiz/update', [TeacherClassroomController::class, 'postUpdateQuizWithQuestions']);
        Route::get('/classroom/joins', [TeacherClassroomController::class, 'getClassJoins']);
        Route::get('/classroom/joins/delete', [TeacherClassroomController::class, 'joinClassDelete']);
        Route::post('/classroom/addstudent', [TeacherClassroomController::class, 'addNewStudent']);
        Route::get('/classroom/code', [TeacherClassroomController::class, 'findByCode']);
    });
Route::middleware(['auth:sanctum', 'role:diak'])
    ->prefix('diak')
    ->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/dasboard', [StudentClassroomController::class, 'getDashboard']);
        Route::get('/classroom', [StudentClassroomController::class, 'getQuizzesWithResultCount']);
        Route::get('/classroom/quiz', [StudentClassroomController::class, 'getQuiz']);
        Route::post('/classroom/quiz/upload', [StudentClassroomController::class, 'postUploadResolute']);
        Route::post('/classroom/addstudent', [TeacherClassroomController::class, 'addNewStudent']);
        Route::get('/classroom/code', [TeacherClassroomController::class, 'findByCode']);
        Route::get('/classroom/joins/create', [StudentClassroomController::class, 'addJoinStudent']);
    });