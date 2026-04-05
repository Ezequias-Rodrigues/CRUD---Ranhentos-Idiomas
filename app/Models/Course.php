<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = ['name', 'description', 'price', 'max_students'];
    
    public function enrollments(): HasMany //Um curso pode ter muitas matriculas
    {
        return $this->hasMany(Enrollment::class);
    }
}
