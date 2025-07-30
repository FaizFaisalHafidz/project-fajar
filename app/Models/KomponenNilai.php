<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KomponenNilai extends Model
{
    use HasFactory;

    protected $table = 'tm_data_komponen_nilai';

    protected $fillable = [
        'mata_pelajaran_id',
        'semester_id',
        'nama_komponen',
        'bobot_persen',
    ];

    protected $casts = [
        'bobot_persen' => 'decimal:2',
    ];

    // Relationships
    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class, 'mata_pelajaran_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function nilaiSiswa(): HasMany
    {
        return $this->hasMany(NilaiSiswa::class, 'komponen_nilai_id');
    }

    // Accessors
    public function getNamaLengkapAttribute()
    {
        return $this->nama_komponen . ' (' . $this->bobot_persen . '%)';
    }
}
