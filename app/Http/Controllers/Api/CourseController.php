<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the courses.
     */
    public function index()
    {
       $courses = Course::all();
       return response()->json($courses);
    }

    /**
     * Store a newly created course in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer|min:1',
            'price' => 'required|required|numeric|between:0,999999999.99',
            'max_students' => 'nullable|integer|min:1',

        ],[ //Aqui em baixo são as mensagens de erro para que o usuario saiba oq ele fez de errado caso não valide
            'name.required' => 'O nome do curso é obrigatório',
            'duration.numeric' => 'A duração do curso deve ser um número válido',
            'duration.min' => 'O curso deve ter duração igual ou superior a 1 semestre',
            'price.required' => 'O preço do curso é obrigatório',
            'price.numeric' => 'O preço deve ser um número válido',
            'price.min' => 'O preço não pode ser negativo',
            'max_students.min' => 'O número máximo de alunos deve ser pelo menos 1',
        ]);
        $course = Course::create($validated);
        return response()->json($course, 201);
    }

    /**
     * Display the specified course.
     */
    public function show(string $id)
    {
        return response()->json(Course::findOrFail($id)); //Retorna 404 caso não haja o curso
    }

    /**
     * Update the specified course in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer',
            'price' => 'sometimes|required|numeric|between:0,999999999.99',
            'max_students' => 'nullable|integer|min:1',

        ],[
            'duration.numeric' => 'A duração do curso deve ser um número válido',
            'duration.min' => 'O curso deve ter duração igual ou superior a 1 semestre',
            'price.numeric' => 'O preço deve ser um número válido',
            'price.min' => 'O preço não pode ser negativo',
            'max_students.min' => 'O número máximo de alunos deve ser pelo menos 1',
        ]);
       // try
        //{//Meu primeiro impulso foi tentar usar um try/catch aqui, mas ao pesquisar, vi que o findOrFail manda 404 caso não encontre o curso automaticamente
        $course = Course::findOrFail($id); //Procura o curso por ID no DB
        $course->update($validated);
        return response()->json($course);
        //}
       // catch (ModelNotFoundException $e)
        //{
            //return response()->json([$e], 404);
        //}

    }

    /**
     * Remove the specified course from storage.
     */
    public function destroy(string $id)
    {
            $course = Course::findOrFail($id);
            $course->delete();
            return response()->json(null, 204);

    }
}
