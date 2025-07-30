<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notifikasi extends Model
{
    use HasFactory;

    protected $table = 'tt_data_notifikasi';

    protected $fillable = [
        'user_id',
        'jenis_notifikasi',
        'judul',
        'pesan',
        'data_tambahan',
        'tanggal_dibaca',
    ];

    protected $casts = [
        'data_tambahan' => 'array',
        'tanggal_dibaca' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeBelumDibaca($query)
    {
        return $query->whereNull('tanggal_dibaca');
    }

    public function scopeSudahDibaca($query)
    {
        return $query->whereNotNull('tanggal_dibaca');
    }

    // Accessors
    public function getIsDibacaAttribute()
    {
        return !is_null($this->tanggal_dibaca);
    }

    // Methods
    public function markAsRead()
    {
        $this->update(['tanggal_dibaca' => now()]);
    }
}
