<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Siswa extends Model
{
    use HasFactory;

    protected $table = 'tm_data_siswa';

    protected $fillable = [
        'user_id',
        'nis',
        'nisn',
        'kelas_id',
        'telepon_orangtua',
        'alamat',
        'tanggal_lahir',
        'jenis_kelamin',
        'tahun_masuk',
        'status_siswa',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tahun_masuk' => 'integer',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function orangTua(): HasMany
    {
        return $this->hasMany(OrangTua::class, 'siswa_id');
    }

    public function nilaiSiswa(): HasMany
    {
        return $this->hasMany(NilaiSiswa::class, 'siswa_id');
    }

    public function hasilClustering(): HasMany
    {
        return $this->hasMany(HasilClustering::class, 'siswa_id');
    }

    public function rekomendasiSiswa(): HasMany
    {
        return $this->hasMany(RekomendasiSiswa::class, 'siswa_id');
    }

    public function raportSiswa(): HasMany
    {
        return $this->hasMany(RaportSiswa::class, 'siswa_id');
    }

    public function absensi(): HasMany
    {
        return $this->hasMany(Absensi::class, 'siswa_id');
    }

    public function nilaiSikap(): HasMany
    {
        return $this->hasMany(NilaiSikap::class, 'siswa_id');
    }

    public function prestasiSiswa(): HasMany
    {
        return $this->hasMany(PrestasiSiswa::class, 'siswa_id');
    }

    public function nilaiEkstrakurikuler(): HasMany
    {
        return $this->hasMany(NilaiEkstrakurikuler::class, 'siswa_id');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status_siswa', 'aktif');
    }

    public function scopeLulus($query)
    {
        return $query->where('status_siswa', 'lulus');
    }

    // Accessors
    public function getNamaLengkapAttribute()
    {
        return $this->user->name;
    }

    public function getUmurAttribute()
    {
        return $this->tanggal_lahir ? $this->tanggal_lahir->age : null;
    }
}
