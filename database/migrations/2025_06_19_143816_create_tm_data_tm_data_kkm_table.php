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
        Schema::create('tm_data_kkm', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mata_pelajaran_id')->constrained('tm_data_mata_pelajaran')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('tm_data_kelas')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('tm_data_semester')->onDelete('cascade');
            $table->decimal('nilai_kkm', 5, 2); // 75.00
            $table->timestamps();
            
            // Nama custom untuk unique constraint
            $table->unique(['mata_pelajaran_id', 'kelas_id', 'semester_id'], 'unique_kkm');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tm_data_kkm');
    }
};
