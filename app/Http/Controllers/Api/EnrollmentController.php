<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\Rule;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of all enrollments.
     */
    public function index()
    {
        // Carrega os relacionamentos para mostrar dados do aluno e curso
        $enrollments = Enrollment::with(['student', 'course'])->get();

        return response()->json([
            'success' => true,
            'data' => $enrollments
        ]);
    }

    /**
     * Store a newly created enrollment.
     */
    public function store(Request $request)
    {
        // Validação dos dados
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'start_date' => 'required|date|after_or_equal:today',
            'price_paid' => 'required|numeric|min:0',
            'status' => ['required', Rule::in(['active', 'cancelled', 'completed'])],
        ], [
            // Mensagens de erro personalizadas
            'student_id.required' => 'O aluno é obrigatório',
            'student_id.exists' => 'O aluno selecionado não existe',
            'course_id.required' => 'O curso é obrigatório',
            'course_id.exists' => 'O curso selecionado não existe',
            'start_date.required' => 'A data de início é obrigatória',
            'start_date.date' => 'A data de início deve ser uma data válida',
            'start_date.after_or_equal' => 'A data de início não pode ser anterior a hoje',
            'price_paid.required' => 'O valor pago é obrigatório',
            'price_paid.numeric' => 'O valor pago deve ser um número válido',
            'price_paid.min' => 'O valor pago não pode ser negativo',
            'status.required' => 'O status é obrigatório',
            'status.in' => 'O status deve ser: active, cancelled ou completed',
        ]);
        $studentExists = false; //Variavel de controle para caso o try abaixo retorne model not found
        // Regras de negócio adicionais
        try {
            // Verificar se o aluno já está matriculado neste curso com status active
            $existingEnrollment = Enrollment::where('student_id', $validated['student_id'])
                ->where('course_id', $validated['course_id'])
                ->where('status', 'active') //Distrinchando isso: usa o id do aluno para checar se ele já está cadastrado no curso, algo tipo SELECT * FROM Enrollment WHERE student_id = $svalidate['student_id'] AND course_id=['course_id'] AND status='active' LIMIT 1
                ->first();
            $studentExists = true; //Isso só vai ser setado pra true se a definição acima acontecer sem lançar erros
            if ($existingEnrollment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este aluno já está ativamente matriculado neste curso',
                    'errors' => [
                        'student_id' => ['Aluno já matriculado neste curso']
                    ]
                ], 422);
            }

            // Verificar se o curso tem vagas disponíveis (se max_students estiver definido)
            $course = Course::findOrFail($validated['course_id']);
            if ($course->max_students) {
                $activeEnrollments = Enrollment::where('course_id', $validated['course_id'])
                    ->where('status', 'active')
                    ->count();

                if ($activeEnrollments >= $course->max_students) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Este curso atingiu o número máximo de alunos',
                        'errors' => [
                            'course_id' => ['Curso lotado: ' . $course->max_students . ' alunos']
                        ]
                    ], 422);
                }
            }

            // Criar a matrícula
            $enrollment = Enrollment::create($validated);

            // Carregar os relacionamentos para retornar dados completos
            $enrollment->load(['student', 'course']);

            return response()->json([
                'success' => true,
                'message' => 'Matrícula realizada com sucesso!',
                'data' => $enrollment
            ], 201);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'success' => false,
                'message' => (!$studentExists) ? 'Aluno' : 'Curso' . ' não encontrado' //Se falhar ao encontrar o estudante, avisa q ele não foi encontrado, caso contrario, o erro foi no curso
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar matrícula: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified enrollment.
     */
    public function show(string $id)
    {
        try {
            $enrollment = Enrollment::with(['student', 'course'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $enrollment
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Matrícula não encontrada'
            ], 404);
        }
    }

    /**
     * Update the specified enrollment.
     */
    public function update(Request $request, string $id)
    {
        try {
            $enrollment = Enrollment::findOrFail($id);

            // Validação dos dados (todos opcionais pois é update)
            $validated = $request->validate([
                'student_id' => 'sometimes|exists:students,id',
                'course_id' => 'sometimes|exists:courses,id',
                'start_date' => 'sometimes|date|after_or_equal:today',
                'price_paid' => 'sometimes|numeric|min:0',
                'status' => ['sometimes', Rule::in(['active', 'cancelled', 'completed'])],
            ], [
                'student_id.exists' => 'O aluno selecionado não existe',
                'course_id.exists' => 'O curso selecionado não existe',
                'start_date.date' => 'A data de início deve ser uma data válida',
                'start_date.after_or_equal' => 'A data de início não pode ser anterior a hoje',
                'price_paid.numeric' => 'O valor pago deve ser um número válido',
                'price_paid.min' => 'O valor pago não pode ser negativo',
                'status.in' => 'O status deve ser: active, cancelled ou completed',
            ]);

            // Se estiver mudando o status para cancelled ou completed, regras especiais
            if (isset($validated['status'])) {
                if ($validated['status'] === 'cancelled' && $enrollment->status === 'completed') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Não é possível cancelar uma matrícula já concluída',
                        'errors' => [
                            'status' => ['Matrícula concluída não pode ser cancelada']
                        ]
                    ], 422);
                }

                if ($validated['status'] === 'completed' && $enrollment->status === 'cancelled') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Não é possível concluir uma matrícula cancelada',
                        'errors' => [
                            'status' => ['Matrícula cancelada não pode ser concluída']
                        ]
                    ], 422);
                }
            }

            // Se estiver mudando o curso, verificar vagas
            if (isset($validated['course_id']) && $validated['course_id'] != $enrollment->course_id) {
                $course = Course::findOrFail($validated['course_id']);
                if ($course->max_students) {
                    $activeEnrollments = Enrollment::where('course_id', $validated['course_id'])
                        ->where('status', 'active')
                        ->where('id', '!=', $id) // Exclui a matrícula atual
                        ->count();

                    if ($activeEnrollments >= $course->max_students) {
                        return response()->json([
                            'success' => false,
                            'message' => 'O novo curso selecionado está lotado',
                            'errors' => [
                                'course_id' => ['Curso sem vagas disponíveis']
                            ]
                        ], 422);
                    }
                }
            }

            // Atualizar a matrícula
            $enrollment->update($validated);
            $enrollment->load(['student', 'course']);

            return response()->json([
                'success' => true,
                'message' => 'Matrícula atualizada com sucesso!',
                'data' => $enrollment
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Matrícula não encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar matrícula: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified enrollment.
     */
    public function destroy(string $id)
    {
        try {
            $enrollment = Enrollment::findOrFail($id);

            // Impedir deletar matrículas com status completed (opcional, regra de negócio)
            if ($enrollment->status === 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Não é possível excluir uma matrícula já concluída'
                ], 422);
            }

            $enrollment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Matrícula removida com sucesso!'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Matrícula não encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao remover matrícula: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get enrollments by student.
     */
    public function getByStudent(string $studentId)
    {
        try {
            $student = Student::findOrFail($studentId);
            $enrollments = Enrollment::with('course')
                ->where('student_id', $studentId)
                ->get();

            return response()->json([
                'success' => true,
                'student' => $student->name,
                'data' => $enrollments
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Aluno não encontrado'
            ], 404);
        }
    }

    /**
     * Get enrollments by course.
     */
    public function getByCourse(string $courseId)
    {
        try {
            $course = Course::findOrFail($courseId);
            $enrollments = Enrollment::with('student')
                ->where('course_id', $courseId)
                ->get();

            return response()->json([
                'success' => true,
                'course' => $course->name,
                'data' => $enrollments
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Curso não encontrado'
            ], 404);
        }
    }
}
