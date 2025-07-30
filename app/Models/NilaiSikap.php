<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NilaiSikap extends Model
{
    use HasFactory;

    protected $table = 'tt_data_nilai_sikap';

    protected $fillable = [
        'siswa_id',
        'semester_id',
        'guru_id',
        'nilai_sosial',
        'deskripsi_sosial',
        'nilai_spiritual',
        'deskripsi_spiritual',
    ];

    // Relationships
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'guru_id');
    }
}
