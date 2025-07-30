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
        Schema::create('tm_data_jurusan', function (Blueprint $table) {
            $table->id();
            $table->string('kode_jurusan', 10)->unique();
            $table->string('nama_jurusan', 100);
            $table->text('deskripsi')->nullable();
            $table->timestamps();
            
            $table->index('kode_jurusan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tm_data_jurusan');
    }
};
