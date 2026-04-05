<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    \App\Models\Student::create([
        'name' => 'João Silva',
        'email' => 'joao@email.com',
        'phone' => '(11) 99999-9999'
    ]);
    
    \App\Models\Student::create([
        'name' => 'Maria Oliveira',
        'email' => 'maria@email.com',
        'phone' => '(11) 88888-8888'
    ]);

    \App\Models\Student::create([
        'name' => 'Pedro Oliveira',
        'email' => 'Pedro@email.com',
        'phone' => '(11) 88888-8888'
    ]);

    \App\Models\Student::create([
        'name' => 'Ezequias R',
        'email' => 'ezequias@email.com',
        'phone' => '(11) 0000-0000'
    ]);
}
}
