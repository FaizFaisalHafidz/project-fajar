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
        Schema::create('tm_data_config_clustering', function (Blueprint $table) {
            $table->id();
            $table->foreignId('semester_id')->constrained('tm_data_semester')->onDelete('cascade');
            $table->integer('jumlah_cluster')->default(3);
            $table->json('fitur_yang_digunakan'); // mata pelajaran yang dianalisis
            $table->json('parameter_algoritma')->nullable(); // K-means parameters
            $table->boolean('status_aktif')->default(true);
            $table->timestamps();
            
            $table->index('semester_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tm_data_config_clustering');
    }
};
