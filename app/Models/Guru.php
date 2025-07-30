<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guru extends Model
{
    use HasFactory;

    protected $table = 'tm_data_guru';

    protected $fillable = [
        'user_id',
        'nip',
        'nomor_telepon',
        'alamat',
        'tanggal_lahir',
        'spesialisasi_mapel',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kelasWali(): HasMany
    {
        return $this->hasMany(Kelas::class, 'wali_kelas_id');
    }

    public function penugasanMengajar(): HasMany
    {
        return $this->hasMany(PenugasanMengajar::class, 'guru_id');
    }

    public function nilaiSiswa(): HasMany
    {
        return $this->hasMany(NilaiSiswa::class, 'guru_id');
    }

    // Accessors
    public function getNamaLengkapAttribute()
    {
        return $this->user->name;
    }

    public function getIsWaliKelasAttribute()
    {
        return $this->kelasWali()->exists();
    }
}
