<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'tt_data_absensi';

    protected $fillable = [
        'siswa_id',
        'semester_id',
        'jumlah_sakit',
        'jumlah_izin',
        'jumlah_tanpa_keterangan',
    ];

    protected $casts = [
        'jumlah_sakit' => 'integer',
        'jumlah_izin' => 'integer',
        'jumlah_tanpa_keterangan' => 'integer',
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
}
