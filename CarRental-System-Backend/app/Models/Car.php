<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'model',
        'plate_number',
        'rate_per_hour',
        'rate_per_day',
        'status',
        'owner_id',
    ];

    protected $casts = [
        'rate_per_hour' => 'decimal:2',
        'rate_per_day'  => 'decimal:2',
    ];

    public function owner()
    {
        return $this->belongsTo(CarOwner::class, 'owner_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}