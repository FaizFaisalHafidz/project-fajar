<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestasiSiswa extends Model
{
    use HasFactory;

    protected $table = 'tt_data_prestasi_siswa';

    protected $fillable = [
        'siswa_id',
        'semester_id',
        'jenis_prestasi',
        'nama_prestasi',
        'tingkat', // sekolah, kecamatan, kabupaten, provinsi, nasional
        'peringkat',
        'tanggal_prestasi',
        'deskripsi',
    ];

    protected $casts = [
        'tanggal_prestasi' => 'date',
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
