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
        Schema::create('tt_data_nilai_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('tm_data_siswa')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('tm_data_mata_pelajaran')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('tm_data_semester')->onDelete('cascade');
            $table->foreignId('komponen_nilai_id')->constrained('tm_data_komponen_nilai')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('tm_data_guru')->onDelete('cascade');
            $table->decimal('nilai', 5, 2); // 85.50
            $table->date('tanggal_input');
            $table->text('catatan')->nullable();
            $table->timestamps();
            
            // Nama custom untuk unique constraint
            $table->unique(['siswa_id', 'mata_pelajaran_id', 'komponen_nilai_id', 'semester_id'], 'unique_nilai_siswa');
            $table->index(['siswa_id', 'semester_id']);
            $table->index(['mata_pelajaran_id', 'semester_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tt_data_nilai_siswa');
    }
};
