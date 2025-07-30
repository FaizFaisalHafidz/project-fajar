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
        Schema::create('tt_data_prestasi_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('tm_data_siswa')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('tm_data_semester')->onDelete('cascade');
            $table->enum('jenis_prestasi', ['akademik', 'non_akademik', 'olahraga', 'seni', 'lainnya']);
            $table->string('nama_prestasi', 200);
            $table->enum('tingkat', ['sekolah', 'kecamatan', 'kabupaten', 'provinsi', 'nasional', 'internasional']);
            $table->string('peringkat', 50); // Juara 1, Juara 2, Finalis, dll
            $table->date('tanggal_prestasi');
            $table->text('deskripsi')->nullable();
            $table->timestamps();
            
            $table->index(['siswa_id', 'semester_id']);
            $table->index(['jenis_prestasi']);
            $table->index(['tingkat']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tt_data_prestasi_siswa');
    }
};
