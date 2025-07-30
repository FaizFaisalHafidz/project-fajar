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
        Schema::create('tm_data_komponen_nilai', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mata_pelajaran_id')->constrained('tm_data_mata_pelajaran')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('tm_data_semester')->onDelete('cascade');
            $table->string('nama_komponen', 50); // UH1, UH2, UTS, UAS, Tugas, Praktik
            $table->decimal('bobot_persen', 5, 2); // 25.50
            $table->timestamps();
            
            $table->index(['mata_pelajaran_id', 'semester_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tm_data_komponen_nilai');
    }
};
