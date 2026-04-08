<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Student;
use App\Models\Course;
use App\Models\Enrollment;

class ReportTest extends TestCase
{
    public function test_can_get_investment_per_student()
    {
        $student = Student::factory()->create();
        $course = Course::factory()->create(['price' => 500]);

        Enrollment::create([
            'student_id' => $student->id,
            'course_id' => $course->id,
            'start_date' => now(),
            'price_paid' => 500,
            'status' => 'active'
        ]);

        $response = $this->getJson('/api/reports/investment-per-student');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'summary']);
    }
}
