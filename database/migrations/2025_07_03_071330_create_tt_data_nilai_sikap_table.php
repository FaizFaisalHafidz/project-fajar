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
        Schema::create('tt_data_nilai_sikap', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('tm_data_siswa')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('tm_data_semester')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('tm_data_guru')->onDelete('cascade');
            $table->enum('nilai_sosial', ['A', 'B', 'C', 'D'])->nullable();
            $table->text('deskripsi_sosial')->nullable();
            $table->enum('nilai_spiritual', ['A', 'B', 'C', 'D'])->nullable();
            $table->text('deskripsi_spiritual')->nullable();
            $table->timestamps();
            
            $table->unique(['siswa_id', 'semester_id'], 'unique_nilai_sikap');
            $table->index(['semester_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tt_data_nilai_sikap');
    }
};
