<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kkm extends Model
{
    use HasFactory;

    protected $table = 'tm_data_kkm';

    protected $fillable = [
        'mata_pelajaran_id',
        'kelas_id',
        'semester_id',
        'nilai_kkm',
    ];

    protected $casts = [
        'nilai_kkm' => 'decimal:2',
    ];

    // Relationships
    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class, 'mata_pelajaran_id');
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
}
