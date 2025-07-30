<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ekstrakurikuler extends Model
{
    use HasFactory;

    protected $table = 'tm_data_ekstrakurikuler';

    protected $fillable = [
        'nama_ekstrakurikuler',
        'deskripsi',
        'pembina_id',
        'status_aktif',
    ];

    protected $casts = [
        'status_aktif' => 'boolean',
    ];

    // Relationships
    public function pembina(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'pembina_id');
    }

    public function nilaiEkstrakurikuler(): HasMany
    {
        return $this->hasMany(NilaiEkstrakurikuler::class, 'ekstrakurikuler_id');
    }
}
