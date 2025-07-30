<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HasilClustering extends Model
{
    use HasFactory;

    protected $table = 'tt_data_hasil_clustering';

    protected $fillable = [
        'config_clustering_id',
        'siswa_id',
        'cluster_id',
        'nilai_rata_rata',
        'jarak_centroid',
        'tahun_ajaran_id',
        'semester_id',
    ];

    protected $casts = [
        'cluster_id' => 'integer',
        'nilai_rata_rata' => 'decimal:2',
        'jarak_centroid' => 'decimal:4',
    ];

    // Relationships
    public function configClustering(): BelongsTo
    {
        return $this->belongsTo(ConfigClustering::class, 'config_clustering_id');
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function rekomendasiSiswa(): HasMany
    {
        return $this->hasMany(RekomendasiSiswa::class, 'hasil_clustering_id');
    }
}
