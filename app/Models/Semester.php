<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends Model
{
    use HasFactory;

    protected $table = 'tm_data_semester';

    protected $fillable = [
        'tahun_ajaran_id',
        'nama_semester',
        'tanggal_mulai',
        'tanggal_selesai',
        'status_aktif',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'status_aktif' => 'boolean',
    ];

    // Relationships
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    public function komponenNilai(): HasMany
    {
        return $this->hasMany(KomponenNilai::class, 'semester_id');
    }

    public function nilaiSiswa(): HasMany
    {
        return $this->hasMany(NilaiSiswa::class, 'semester_id');
    }

    public function configClustering(): HasMany
    {
        return $this->hasMany(ConfigClustering::class, 'semester_id');
    }

    public function kkm(): HasMany
    {
        return $this->hasMany(Kkm::class, 'semester_id');
    }

    public function absensi(): HasMany
    {
        return $this->hasMany(Absensi::class, 'semester_id');
    }

    public function nilaiSikap(): HasMany
    {
        return $this->hasMany(NilaiSikap::class, 'semester_id');
    }

    public function prestasiSiswa(): HasMany
    {
        return $this->hasMany(PrestasiSiswa::class, 'semester_id');
    }

    public function nilaiEkstrakurikuler(): HasMany
    {
        return $this->hasMany(NilaiEkstrakurikuler::class, 'semester_id');
    }

    public function templateRaport(): HasMany
    {
        return $this->hasMany(TemplateRaport::class, 'semester_id');
    }

    public function raportSiswa(): HasMany
    {
        return $this->hasMany(RaportSiswa::class, 'semester_id');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status_aktif', true);
    }

    // Accessors
    public function getNamaLengkapAttribute()
    {
        return $this->nama_semester . ' ' . $this->tahunAjaran->nama_tahun_ajaran;
    }
}
