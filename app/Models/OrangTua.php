<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrangTua extends Model
{
    use HasFactory;

    protected $table = 'tm_data_orangtua';

    protected $fillable = [
        'user_id',
        'siswa_id',
        'hubungan_keluarga',
        'nomor_telepon',
        'pekerjaan',
        'alamat',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }

    // Accessors
    public function getNamaLengkapAttribute()
    {
        return $this->user->name;
    }
}
