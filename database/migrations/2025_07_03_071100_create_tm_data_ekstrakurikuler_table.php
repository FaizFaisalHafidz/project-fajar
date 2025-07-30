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
        Schema::create('tm_data_ekstrakurikuler', function (Blueprint $table) {
            $table->id();
            $table->string('nama_ekstrakurikuler', 100);
            $table->text('deskripsi')->nullable();
            $table->foreignId('pembina_id')->nullable()->constrained('tm_data_guru')->onDelete('set null');
            $table->boolean('status_aktif')->default(true);
            $table->timestamps();
            
            $table->index('status_aktif');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tm_data_ekstrakurikuler');
    }
};
