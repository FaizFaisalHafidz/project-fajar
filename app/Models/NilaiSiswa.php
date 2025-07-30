<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NilaiSiswa extends Model
{
    use HasFactory;

    protected $table = 'tt_data_nilai_siswa';

    protected $fillable = [
        'siswa_id',
        'mata_pelajaran_id',
        'semester_id',
        'komponen_nilai_id',
        'guru_id',
        'nilai',
        'tanggal_input',
        'catatan',
    ];

    protected $casts = [
        'nilai' => 'decimal:2',
        'tanggal_input' => 'date',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }

    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class, 'mata_pelajaran_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function komponenNilai(): BelongsTo
    {
        return $this->belongsTo(KomponenNilai::class, 'komponen_nilai_id');
    }

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'guru_id');
    }

    // Scopes
    public function scopeBySemester($query, $semesterId)
    {
        return $query->where('semester_id', $semesterId);
    }

    // Accessors
    public function getStatusKelulusanAttribute()
    {
        $kkm = Kkm::where('mata_pelajaran_id', $this->mata_pelajaran_id)
                  ->where('kelas_id', $this->siswa->kelas_id)
                  ->where('semester_id', $this->semester_id)
                  ->first();
        
        if ($kkm) {
            return $this->nilai >= $kkm->nilai_kkm ? 'Tuntas' : 'Belum Tuntas';
        }
        
        return 'KKM Belum Ditetapkan';
    }
}
