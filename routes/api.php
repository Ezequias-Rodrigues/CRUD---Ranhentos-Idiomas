<?php

use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

Route::apiResource('students', StudentController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('enrollments', EnrollmentController::class);

// Rotas de relatórios
Route::get('reports/investment-per-student', [ReportController::class, 'investmentPerStudent']);
Route::get('reports/popular-courses', [ReportController::class, 'popularCourses']);
Route::get('reports/revenue-per-course', [ReportController::class, 'revenuePerCourse']);
