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
        Schema::create('tt_data_notifikasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('jenis_notifikasi', 50);
            $table->string('judul', 200);
            $table->text('pesan');
            $table->json('data_tambahan')->nullable();
            $table->timestamp('tanggal_dibaca')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'tanggal_dibaca']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tt_data_notifikasi');
    }
};
