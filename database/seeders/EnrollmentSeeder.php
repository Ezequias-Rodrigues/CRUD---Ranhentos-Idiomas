<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Course;
use App\Models\Enrollment;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        // Criar algumas matrículas de exemplo
        $matriculas = [
            ['student_id' => 1, 'course_id' => 1, 'start_date' => '2026-01-15', 'price_paid' => 500.00, 'status' => 'completed'],
            ['student_id' => 1, 'course_id' => 2, 'start_date' => '2026-02-20', 'price_paid' => 600.00, 'status' => 'active'],
            ['student_id' => 2, 'course_id' => 1, 'start_date' => '2026-03-10', 'price_paid' => 500.00, 'status' => 'active'],
            ['student_id' => 2, 'course_id' => 3, 'start_date' => '2026-04-01', 'price_paid' => 700.00, 'status' => 'cancelled'],
            ['student_id' => 1, 'course_id' => 3, 'start_date' => '2026-04-05', 'price_paid' => 700.00, 'status' => 'active'],
        ];

        foreach ($matriculas as $matricula) {
            Enrollment::create($matricula);
        }
    }
}
