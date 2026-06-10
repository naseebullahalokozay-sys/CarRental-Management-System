<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guarantee extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'type',
        'description',
        'photo',
        'status',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}