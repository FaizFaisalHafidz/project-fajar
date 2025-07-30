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
        Schema::create('tt_data_rekomendasi_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('tm_data_siswa')->onDelete('cascade');
            $table->foreignId('hasil_clustering_id')->constrained('tt_data_hasil_clustering')->onDelete('cascade');
            $table->string('jenis_rekomendasi', 100);
            $table->text('isi_rekomendasi');
            $table->enum('prioritas', ['rendah', 'sedang', 'tinggi'])->default('sedang');
            $table->enum('status', ['aktif', 'selesai', 'diabaikan'])->default('aktif');
            $table->timestamps();
            
            $table->index(['siswa_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tt_data_rekomendasi_siswa');
    }
};
