<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'tm_data_kelas';

    protected $fillable = [
        'jurusan_id',
        'tahun_ajaran_id',
        'nama_kelas',
        'tingkat_kelas',
        'wali_kelas_id',
    ];

    // Relationships
    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class, 'jurusan_id');
    }

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    public function waliKelas(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'wali_kelas_id');
    }

    public function siswa(): HasMany
    {
        return $this->hasMany(Siswa::class, 'kelas_id');
    }

    public function penugasanMengajar(): HasMany
    {
        return $this->hasMany(PenugasanMengajar::class, 'kelas_id');
    }

    public function kkm(): HasMany
    {
        return $this->hasMany(Kkm::class, 'kelas_id');
    }

    // Scopes
    public function scopeTingkat($query, $tingkat)
    {
        return $query->where('tingkat_kelas', $tingkat);
    }

    // Accessors
    public function getNamaLengkapAttribute()
    {
        return $this->nama_kelas . ' (' . $this->jurusan->nama_jurusan . ')';
    }

    public function getJumlahSiswaAttribute()
    {
        return $this->siswa()->where('status_siswa', 'aktif')->count();
    }
}
