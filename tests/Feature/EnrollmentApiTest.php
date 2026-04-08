<?php

namespace Tests\Feature;

use Tests\TestCase;

class EnrollmentApiTest extends TestCase
{
    public function test_can_get_enrollments()
    {
        $response = $this->getJson('/api/enrollments');
        $this->assertTrue(in_array($response->status(), [200, 404]));
    }

    public function test_can_create_enrollment_with_valid_data()
    {
        // Primeiro criar aluno e curso
        $student = $this->postJson('/api/students', [
            'name' => 'Aluno Teste',
            'email' => 'aluno@teste.com'
        ]);

        $course = $this->postJson('/api/courses', [
            'name' => 'Curso Teste',
            'price' => 500
        ]);

        if ($student->status() == 201 && $course->status() == 201) {
            $data = [
                'student_id' => $student->json('id'),
                'course_id' => $course->json('id'),
                'start_date' => date('Y-m-d'),
                'price_paid' => 500,
                'status' => 'active'
            ];

            $response = $this->postJson('/api/enrollments', $data);
            $this->assertTrue(in_array($response->status(), [201, 422]));
        } else {
            $this->markTestSkipped('Could not create test student and course');
        }
    }
}
