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
        Schema::create('tt_data_raport_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('tm_data_siswa')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('tm_data_semester')->onDelete('cascade');
            $table->foreignId('template_id')->constrained('tm_data_template_raport')->onDelete('cascade');
            $table->json('data_raport');
            $table->string('file_path')->nullable();
            $table->datetime('tanggal_generate');
            $table->timestamps();
            
            $table->unique(['siswa_id', 'semester_id']);
            $table->index('tanggal_generate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tt_data_raport_siswa');
    }
};
