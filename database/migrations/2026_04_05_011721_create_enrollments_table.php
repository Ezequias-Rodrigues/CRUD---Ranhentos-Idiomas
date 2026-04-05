<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade'); //Foreign key para o id do estudante
            $table->foreignId('course_id')->constrained()->onDelete('cascade'); // foregin key para o id do curso. A ideia é "matricula é a relação estudante-curso"
            $table->date('start_date');
            $table->decimal('price_paid', 10, 2);#Decimal de até 10 digitos, com 2 casas decimais. Decimais tem precisão maior do que float, então dinheiro = decimal
            $table->enum('status', ['active', 'cancelled', 'completed'])->default('active');//Enuns? Interessante...
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
