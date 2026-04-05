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
     * Mostra quanto cada aluno já pagou em todas as matrículas
     */
    public function investmentPerStudent()
    {
        try {
            // Opção 1: Usando Eloquent com relacionamentos
            $students = Student::with(['enrollments' => function($query) {
                $query->where('status', '!=', 'cancelled'); // Não conta matrículas canceladas
            }])->get();

            $report = $students->map(function($student) {
                return [
                    'student_id' => $student->id,
                    'student_name' => $student->name,
                    'student_email' => $student->email,
                    'total_invested' => (float) $student->enrollments->sum('price_paid'),
                    'total_courses' => $student->enrollments->count(),
                    'active_courses' => $student->enrollments->where('status', 'active')->count(),
                    'completed_courses' => $student->enrollments->where('status', 'completed')->count(),
                ];
            })->sortByDesc('total_invested')->values(); // Ordena por maior investidor

            return response()->json([
                'success' => true,
                'report_type' => 'Total Investido por Aluno',
                'data' => $report,
                'summary' => [
                    'total_students' => $students->count(),
                    'total_invested_all' => (float) $report->sum('total_invested'),
                    'average_per_student' => $students->count() > 0 ?
                        (float) ($report->sum('total_invested') / $students->count()) : 0
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao gerar relatório de investimento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Relatório 2: Cursos com mais alunos
     * Mostra a popularidade dos cursos baseado no número de matrículas
     */
    public function popularCourses()
    {
        try {
            // Opção 1: Usando Query Builder com join e count
            $popularCourses = DB::table('courses')
                ->leftJoin('enrollments', 'courses.id', '=', 'enrollments.course_id')
                ->select(
                    'courses.id',
                    'courses.name',
                    'courses.description',
                    'courses.price',
                    'courses.max_students',
                    DB::raw('COUNT(enrollments.id) as total_enrollments'),
                    DB::raw('SUM(CASE WHEN enrollments.status = "active" THEN 1 ELSE 0 END) as active_enrollments'),
                    DB::raw('SUM(CASE WHEN enrollments.status = "completed" THEN 1 ELSE 0 END) as completed_enrollments'),
                    DB::raw('SUM(CASE WHEN enrollments.status = "cancelled" THEN 1 ELSE 0 END) as cancelled_enrollments')
                )
                ->groupBy('courses.id', 'courses.name', 'courses.description', 'courses.price', 'courses.max_students')
                ->orderByDesc('total_enrollments')
                ->get();

            // Calcular ocupação percentual para cada curso
            $popularCourses->transform(function($course) {
                $course->occupancy_percentage = $course->max_students > 0 ?
                    round(($course->total_enrollments / $course->max_students) * 100, 2) : null;
                $course->total_enrollments = (int) $course->total_enrollments;
                $course->active_enrollments = (int) $course->active_enrollments;
                $course->completed_enrollments = (int) $course->completed_enrollments;
                $course->cancelled_enrollments = (int) $course->cancelled_enrollments;
                return $course;
            });

            return response()->json([
                'success' => true,
                'report_type' => 'Cursos com Mais Alunos',
                'data' => $popularCourses,
                'summary' => [
                    'total_courses' => $popularCourses->count(),
                    'total_enrollments_all' => (int) $popularCourses->sum('total_enrollments'),
                    'most_popular_course' => $popularCourses->isNotEmpty() ?
                        $popularCourses->first()->name : null,
                    'most_popular_count' => $popularCourses->isNotEmpty() ?
                        (int) $popularCourses->first()->total_enrollments : 0
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao gerar relatório de cursos populares: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Relatório 3: Faturamento total por curso
     * Mostra quanto dinheiro cada curso gerou
     */
    public function revenuePerCourse()
    {
        try {
            // Opção 1: Usando Eloquent com relacionamento
            $courses = Course::with(['enrollments' => function($query) {
                $query->where('status', '!=', 'cancelled'); // Não fatura matrículas canceladas
            }])->get();

            $report = $courses->map(function($course) {
                $totalRevenue = $course->enrollments->sum('price_paid');
                $activeRevenue = $course->enrollments->where('status', 'active')->sum('price_paid');
                $completedRevenue = $course->enrollments->where('status', 'completed')->sum('price_paid');

                return [
                    'course_id' => $course->id,
                    'course_name' => $course->name,
                    'course_price' => (float) $course->price,
                    'total_revenue' => (float) $totalRevenue,
                    'active_revenue' => (float) $activeRevenue,
                    'completed_revenue' => (float) $completedRevenue,
                    'total_enrollments' => $course->enrollments->count(),
                    'active_enrollments' => $course->enrollments->where('status', 'active')->count(),
                    'completed_enrollments' => $course->enrollments->where('status', 'completed')->count(),
                    'average_ticket' => $course->enrollments->count() > 0 ?
                        (float) ($totalRevenue / $course->enrollments->count()) : 0
                ];
            })->sortByDesc('total_revenue')->values();

            return response()->json([
                'success' => true,
                'report_type' => 'Faturamento Total por Curso',
                'data' => $report,
                'summary' => [
                    'total_courses' => $courses->count(),
                    'total_revenue_all' => (float) $report->sum('total_revenue'),
                    'average_revenue_per_course' => $courses->count() > 0 ?
                        (float) ($report->sum('total_revenue') / $courses->count()) : 0,
                    'highest_revenue_course' => $report->isNotEmpty() ?
                        $report->first()->course_name : null,
                    'highest_revenue_value' => $report->isNotEmpty() ?
                        (float) $report->first()->total_revenue : 0
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao gerar relatório de faturamento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * BÔNUS: Dashboard com todos os relatórios em uma única requisição
     */
    public function dashboard()
    {
        try {
            $investmentReport = $this->investmentPerStudent()->getData();
            $popularCoursesReport = $this->popularCourses()->getData();
            $revenueReport = $this->revenuePerCourse()->getData();

            return response()->json([
                'success' => true,
                'generated_at' => now()->format('Y-m-d H:i:s'),
                'investment_per_student' => $investmentReport->success ? $investmentReport->data : [],
                'popular_courses' => $popularCoursesReport->success ? $popularCoursesReport->data : [],
                'revenue_per_course' => $revenueReport->success ? $revenueReport->data : [],
                'global_summary' => [
                    'total_students' => Student::count(),
                    'total_courses' => Course::count(),
                    'total_enrollments' => Enrollment::count(),
                    'total_revenue' => (float) Enrollment::where('status', '!=', 'cancelled')->sum('price_paid'),
                    'active_enrollments' => Enrollment::where('status', 'active')->count(),
                    'completed_enrollments' => Enrollment::where('status', 'completed')->count(),
                    'cancelled_enrollments' => Enrollment::where('status', 'cancelled')->count()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao gerar dashboard: ' . $e->getMessage()
            ], 500);
        }
    }
}
