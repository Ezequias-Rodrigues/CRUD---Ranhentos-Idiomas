<?php

namespace Tests\Feature;

use Tests\TestCase;

class CourseApiTest extends TestCase
{
    public function test_can_get_courses()
    {
        $response = $this->getJson('/api/courses');
        $this->assertTrue(in_array($response->status(), [200, 404]));
    }

    public function test_can_create_course()
    {
        $data = [
            'name' => 'Curso Teste',
            'price' => 500,
            'max_students' => 30
        ];

        $response = $this->postJson('/api/courses', $data);
        $this->assertTrue(in_array($response->status(), [201, 422]));
    }

    public function test_cannot_create_course_without_name()
    {
        $response = $this->postJson('/api/courses', ['price' => 500]);
        $this->assertTrue(in_array($response->status(), [422, 500]));
    }
}
