<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RekomendasiSiswa extends Model
{
    use HasFactory;

    protected $table = 'tt_data_rekomendasi_siswa';

    protected $fillable = [
        'siswa_id',
        'hasil_clustering_id',
        'jenis_rekomendasi',
        'isi_rekomendasi',
        'prioritas',
        'status',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }

    public function hasilClustering(): BelongsTo
    {
        return $this->belongsTo(HasilClustering::class, 'hasil_clustering_id');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopePrioritas($query, $prioritas)
    {
        return $query->where('prioritas', $prioritas);
    }
}
