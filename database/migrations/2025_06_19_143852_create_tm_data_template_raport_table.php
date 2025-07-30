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
        Schema::create('tm_data_template_raport', function (Blueprint $table) {
            $table->id();
            $table->string('nama_template', 100);
            $table->foreignId('semester_id')->constrained('tm_data_semester')->onDelete('cascade');
            $table->json('data_template'); // Template structure
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
        Schema::dropIfExists('tm_data_template_raport');
    }
};
