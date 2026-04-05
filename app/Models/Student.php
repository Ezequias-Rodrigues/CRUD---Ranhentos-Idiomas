<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = ['name', 'email', 'phone'];
    
    public function enrollments(): HasMany //Um estudante pode ter multiplas matriculas
    {
        return $this->hasMany(Enrollment::class);
    }
}
