<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TeacherClassroomController;

// routes/api.php
Route::get('/teachers/{teacher}/classrooms', [TeacherClassroomController::class, 'index']);



