<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RaportSiswa extends Model
{
    use HasFactory;

    protected $table = 'tt_data_raport_siswa';

    protected $fillable = [
        'siswa_id',
        'semester_id',
        'template_id',
        'data_raport',
        'file_path',
        'tanggal_generate',
    ];

    protected $casts = [
        'data_raport' => 'array',
        'tanggal_generate' => 'datetime',
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

    public function template(): BelongsTo
    {
        return $this->belongsTo(TemplateRaport::class, 'template_id');
    }

    // Accessors
    public function getFileUrlAttribute()
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }
}
