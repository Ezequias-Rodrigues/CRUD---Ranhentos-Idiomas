<?php

use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

// Rotas CRUD padrão
Route::apiResource('students', StudentController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('enrollments', EnrollmentController::class);

// Rotas extras para enrollments
Route::get('enrollments/student/{studentId}', [EnrollmentController::class, 'getByStudent']);
Route::get('enrollments/course/{courseId}', [EnrollmentController::class, 'getByCourse']);

// Rotas de relatórios
Route::get('reports/investment-per-student', [ReportController::class, 'investmentPerStudent']);
Route::get('reports/popular-courses', [ReportController::class, 'popularCourses']);
Route::get('reports/revenue-per-course', [ReportController::class, 'revenuePerCourse']);
Route::get('reports/dashboard', [ReportController::class, 'dashboard']);
