<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StudentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_students()
    {
        Student::factory()->count(3)->create();

        $response = $this->getJson('/api/students');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_student()
    {
        $data = [
            'name' => 'João Silva',
            'email' => 'joao@email.com',
            'phone' => '(11) 99999-9999'
        ];

        $response = $this->postJson('/api/students', $data);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'João Silva']);
    }

    public function test_cannot_create_student_without_name()
    {
        $data = ['email' => 'teste@email.com'];

        $response = $this->postJson('/api/students', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_can_update_student()
    {
        $student = Student::factory()->create();

        $response = $this->putJson("/api/students/{$student->id}", [
            'name' => 'Nome Atualizado'
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Nome Atualizado']);
    }

    public function test_can_delete_student()
    {
        $student = Student::factory()->create();

        $response = $this->deleteJson("/api/students/{$student->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('students', ['id' => $student->id]);
    }
}
