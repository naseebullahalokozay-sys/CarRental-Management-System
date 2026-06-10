<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'start_time',
        'end_time',
        'total_hours',
        'total_amount',
        'discount',
        'fine_amount',
    ];

    protected $casts = [
        'start_time'   => 'datetime',
        'end_time'     => 'datetime',
        'total_hours'  => 'decimal:2',
        'total_amount' => 'decimal:2',
        'discount'     => 'decimal:2',
        'fine_amount'  => 'decimal:2',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}