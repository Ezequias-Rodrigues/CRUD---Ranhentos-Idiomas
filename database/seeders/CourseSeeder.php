<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    \App\Models\Course::create([
        'name' => 'Inglês Básico',
        'description' => 'Curso de inglês para iniciantes',
        'price' => 500.00,
        'duration' => 2, #2 semestres
        'max_students' => 30
    ]);
    
    \App\Models\Course::create([
        'name' => 'Espanhol Intermediário',
        'description' => 'Curso de espanhol nível intermediário',
        'price' => 600.00,
        'duration' => 4,
        'max_students' => 25
    ]);

    \App\Models\Course::create([
        'name' => 'Alemão Avançado',
        'description' => 'Curso de Alemão nível Avançado',
        'price' => 1600.00,
        'duration' => 8,
        'max_students' => 15
    ]);
}
}
