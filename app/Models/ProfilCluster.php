<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfilCluster extends Model
{
    use HasFactory;

    protected $table = 'tt_data_profil_cluster';

    protected $fillable = [
        'config_clustering_id',
        'cluster_id',
        'label_cluster',
        'deskripsi',
        'jumlah_siswa',
        'nilai_rata_rata',
        'karakteristik',
        'tahun_ajaran_id',
        'semester_id',
    ];

    protected $casts = [
        'cluster_id' => 'integer',
        'jumlah_siswa' => 'integer',
        'nilai_rata_rata' => 'decimal:2',
        'karakteristik' => 'array',
    ];

    // Relationships
    public function configClustering(): BelongsTo
    {
        return $this->belongsTo(ConfigClustering::class, 'config_clustering_id');
    }

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
}
