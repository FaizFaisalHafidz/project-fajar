<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConfigClustering extends Model
{
    use HasFactory;

    protected $table = 'tm_data_config_clustering';

    protected $fillable = [
        'semester_id',
        'jumlah_cluster',
        'fitur_yang_digunakan',
        'parameter_algoritma',
        'status_aktif',
    ];

    protected $casts = [
        'jumlah_cluster' => 'integer',
        'fitur_yang_digunakan' => 'array',
        'parameter_algoritma' => 'array',
        'status_aktif' => 'boolean',
    ];

    // Relationships
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function hasilClustering(): HasMany
    {
        return $this->hasMany(HasilClustering::class, 'config_clustering_id');
    }

    public function profilCluster(): HasMany
    {
        return $this->hasMany(ProfilCluster::class, 'config_clustering_id');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status_aktif', true);
    }
}
