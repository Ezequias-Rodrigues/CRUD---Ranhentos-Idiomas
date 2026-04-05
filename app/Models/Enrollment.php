<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    protected $fillable = ['student_id', 'course_id', 'start_date', 'price_paid', 'status'];
    
    protected $casts = [
        'start_date' => 'date',
    ];
    
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class); //Essa matricula pertence a um estudante
    }
    
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class); //E também a um curso
    }
}