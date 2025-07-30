<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TemplateRaport extends Model
{
    use HasFactory;

    protected $table = 'tm_data_template_raport';

    protected $fillable = [
        'nama_template',
        'semester_id',
        'data_template',
        'status_aktif',
    ];

    protected $casts = [
        'data_template' => 'array',
        'status_aktif' => 'boolean',
    ];

    // Relationships
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function raportSiswa(): HasMany
    {
        return $this->hasMany(RaportSiswa::class, 'template_id');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status_aktif', true);
    }
}
