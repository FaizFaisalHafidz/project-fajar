<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MataPelajaran extends Model
{
    use HasFactory;

    protected $table = 'tm_data_mata_pelajaran';

    protected $fillable = [
        'kode_mapel',
        'nama_mapel',
        'deskripsi',
        'jam_pelajaran',
    ];

    protected $casts = [
        'jam_pelajaran' => 'integer',
    ];

    // Relationships
    public function komponenNilai(): HasMany
    {
        return $this->hasMany(KomponenNilai::class, 'mata_pelajaran_id');
    }

    public function nilaiSiswa(): HasMany
    {
        return $this->hasMany(NilaiSiswa::class, 'mata_pelajaran_id');
    }

    public function penugasanMengajar(): HasMany
    {
        return $this->hasMany(PenugasanMengajar::class, 'mata_pelajaran_id');
    }

    public function kkm(): HasMany
    {
        return $this->hasMany(Kkm::class, 'mata_pelajaran_id');
    }

    // Accessors
    public function getNamaLengkapAttribute()
    {
        return $this->kode_mapel . ' - ' . $this->nama_mapel;
    }
}
