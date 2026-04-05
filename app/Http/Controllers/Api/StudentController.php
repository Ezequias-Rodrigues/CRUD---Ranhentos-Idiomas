<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::all();
        return response()->json($students);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students',
            'phone' => 'nullable|string'
        ]);
        
        $student = Student::create($validated);
        return response()->json($student, 201);
    }
    
    public function show(Student $student)
    {
        return response()->json($student);
    }
    
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:students,email,' . $student->id,
            'phone' => 'nullable|string'
        ]);
        
        $student->update($validated);
        return response()->json($student);
    }
    
    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(null, 204);
    }
}