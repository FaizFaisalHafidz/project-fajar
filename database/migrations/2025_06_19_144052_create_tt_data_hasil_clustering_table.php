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
        Schema::create('tt_data_hasil_clustering', function (Blueprint $table) {
            $table->id();
            $table->foreignId('config_id')->constrained('tm_data_config_clustering')->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('tm_data_siswa')->onDelete('cascade');
            $table->integer('label_cluster');
            $table->json('centroid_cluster')->nullable();
            $table->date('tanggal_analisis');
            $table->timestamps();
            
            $table->index(['config_id', 'label_cluster']);
            $table->index(['siswa_id', 'tanggal_analisis']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tt_data_hasil_clustering');
    }
};
