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
        Schema::create('tm_data_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nis', 20)->unique();
            $table->string('nisn', 20)->unique()->nullable();
            $table->foreignId('kelas_id')->constrained('tm_data_kelas')->onDelete('cascade');
            $table->string('telepon_orangtua', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->year('tahun_masuk');
            $table->enum('status_siswa', ['aktif', 'lulus', 'dropout', 'pindah'])->default('aktif');
            $table->timestamps();
            
            $table->index(['nis', 'status_siswa']);
            $table->index(['kelas_id', 'status_siswa']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tm_data_siswa');
    }
};
