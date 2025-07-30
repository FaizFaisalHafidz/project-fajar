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
        Schema::create('tt_data_profil_cluster', function (Blueprint $table) {
            $table->id();
            $table->foreignId('config_id')->constrained('tm_data_config_clustering')->onDelete('cascade');
            $table->integer('label_cluster');
            $table->string('nama_cluster', 100);
            $table->json('karakteristik');
            $table->integer('jumlah_siswa');
            $table->json('rata_rata_nilai');
            $table->text('rekomendasi');
            $table->timestamps();
            
            $table->unique(['config_id', 'label_cluster']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tt_data_profil_cluster');
    }
};
