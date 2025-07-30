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
        Schema::create('tt_data_nilai_ekstrakurikuler', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('tm_data_siswa')->onDelete('cascade');
            $table->foreignId('ekstrakurikuler_id')->constrained('tm_data_ekstrakurikuler')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('tm_data_semester')->onDelete('cascade');
            $table->enum('nilai', ['A', 'B', 'C']);
            $table->text('deskripsi')->nullable();
            $table->foreignId('guru_id')->constrained('tm_data_guru')->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['siswa_id', 'ekstrakurikuler_id', 'semester_id'], 'unique_nilai_ekskul');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tt_data_nilai_ekstrakurikuler');
    }
};
