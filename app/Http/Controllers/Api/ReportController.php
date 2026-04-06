<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Relatório 1: Total investido por aluno
     */
    public function investmentPerStudent()
    {
        try {
            $students = Student::with(['enrollments' => function($query) {
                $query->where('status', '!=', 'cancelled');
            }])->get();

            $report = [];
            foreach ($students as $student) {
                $report[] = [
                    'student_id' => $student->id,
                    'student_name' => $student->name,
                    'student_email' => $student->email,
                    'total_invested' => (float) $student->enrollments->sum('price_paid'),
                    'total_courses' => $student->enrollments->count(),
                    'active_courses' => $student->enrollments->where('status', 'active')->count(),
                    'completed_courses' => $student->enrollments->where('status', 'completed')->count(),
                ];
            }

            // Ordenar por maior investidor
            usort($report, function($a, $b) {
                return $b['total_invested'] <=> $a['total_invested'];
            });

            return response()->json([
                'success' => true,
                'data' => $report,
                'summary' => [
                    'total_students' => count($report),
                    'total_invested_all' => (float) array_sum(array_column($report, 'total_invested')),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao gerar relatório: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Relatório 2: Cursos com mais alunos
     */
    public function popularCourses()
    {
        try {
            $courses = Course::all();
            $report = [];

            foreach ($courses as $course) {
                $enrollments = Enrollment::where('course_id', $course->id)->get();
                $totalEnrollments = $enrollments->count();
                $activeEnrollments = $enrollments->where('status', 'active')->count();
                $completedEnrollments = $enrollments->where('status', 'completed')->count();
                $cancelledEnrollments = $enrollments->where('status', 'cancelled')->count();

                $report[] = [
                    'id' => $course->id,
                    'name' => $course->name,
                    'description' => $course->description,
                    'price' => (float) $course->price,
                    'max_students' => $course->max_students,
                    'total_enrollments' => $totalEnrollments,
                    'active_enrollments' => $activeEnrollments,
                    'completed_enrollments' => $completedEnrollments,
                    'cancelled_enrollments' => $cancelledEnrollments,
                    'occupancy_percentage' => $course->max_students && $course->max_students > 0
                        ? round(($totalEnrollments / $course->max_students) * 100, 2)
                        : null
                ];
            }

            // Ordenar por total de matrículas
            usort($report, function($a, $b) {
                return $b['total_enrollments'] <=> $a['total_enrollments'];
            });

            return response()->json([
                'success' => true,
                'data' => $report,
                'summary' => [
                    'total_courses' => count($report),
                    'total_enrollments_all' => array_sum(array_column($report, 'total_enrollments')),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao gerar relatório: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Relatório 3: Faturamento total por curso
     */
    public function revenuePerCourse()
    {
        try {
            $courses = Course::all();
            $report = [];

            foreach ($courses as $course) {
                $enrollments = Enrollment::where('course_id', $course->id)
                    ->where('status', '!=', 'cancelled')
                    ->get();

                $totalRevenue = $enrollments->sum('price_paid');
                $totalEnrollments = $enrollments->count();

                $report[] = [
                    'course_id' => $course->id,
                    'course_name' => $course->name,
                    'course_price' => (float) $course->price,
                    'total_revenue' => (float) $totalRevenue,
                    'total_enrollments' => $totalEnrollments,
                    'average_ticket' => $totalEnrollments > 0 ? (float) ($totalRevenue / $totalEnrollments) : 0
                ];
            }

            // Ordenar por maior faturamento
            usort($report, function($a, $b) {
                return $b['total_revenue'] <=> $a['total_revenue'];
            });

            return response()->json([
                'success' => true,
                'data' => $report,
                'summary' => [
                    'total_courses' => count($report),
                    'total_revenue_all' => (float) array_sum(array_column($report, 'total_revenue')),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao gerar relatório: ' . $e->getMessage()
            ], 500);
        }
    }
}
