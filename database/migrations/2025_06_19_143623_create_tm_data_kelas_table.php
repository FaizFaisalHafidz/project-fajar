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
        Schema::create('tm_data_kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jurusan_id')->constrained('tm_data_jurusan')->onDelete('cascade');
            $table->foreignId('tahun_ajaran_id')->constrained('tm_data_tahun_ajaran')->onDelete('cascade');
            $table->string('nama_kelas', 50);
            $table->enum('tingkat_kelas', ['10', '11', '12']);
            $table->foreignId('wali_kelas_id')->nullable()->constrained('tm_data_guru')->onDelete('set null');
            $table->timestamps();
            
            $table->index(['jurusan_id', 'tahun_ajaran_id', 'tingkat_kelas']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tm_data_kelas');
    }
};
