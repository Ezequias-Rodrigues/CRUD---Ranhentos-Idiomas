<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::all(); //básicamente um SELECT * FROM students
        return response()->json($students); //Retorna um json com uma collection de todos os estudantes
    }

    public function store(Request $request)
    {
        $validated = $request->validate([ //Valida os dados, caso eles não sigam as regras que estão depois do "=>", retorna o erro 422 ou redireciona com erros
            'name' => 'required|string|max:255',//Caso valide certinho, uma array com os campos definidos aqui é retornada
            'email' => 'required|email|unique:students',
            'phone' => 'nullable|string' //Lembro que a gente conversou sobre String vs Int para guardar numeros de telefone, acredito que string se aplica aqui por ser uma demostração
        ]);

        $student = Student::create($validated); //Isso insere os dados na tabela, e retorna o ID
        return response()->json($student, 201);//HTML status Created, ou seja, tudo certinho
    }

    public function show(Student $student)
    {
        return response()->json($student); //Exibe os dados de Student em JSON
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([ //Validação normal
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:students,email,' . $student->id,
            'phone' => 'nullable|string'
        ]);

        $student->update($validated); //Atualiza os campos retornando True or False, porém aqui o valor está sendo descartado
        return response()->json($student); //Exibe os dados em JSON
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(null, 204);
    }
}
