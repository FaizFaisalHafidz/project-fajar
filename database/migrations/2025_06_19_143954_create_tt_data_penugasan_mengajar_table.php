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
        Schema::create('tt_data_penugasan_mengajar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('tm_data_guru')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('tm_data_mata_pelajaran')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('tm_data_kelas')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('tm_data_semester')->onDelete('cascade');
            $table->timestamps();
            
            // Memberikan nama custom untuk unique constraint yang lebih pendek
            $table->unique(['guru_id', 'mata_pelajaran_id', 'kelas_id', 'semester_id'], 'unique_penugasan_mengajar');
            $table->index(['guru_id', 'semester_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tt_data_penugasan_mengajar');
    }
};
