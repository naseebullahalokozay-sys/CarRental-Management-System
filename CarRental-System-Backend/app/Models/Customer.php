<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'tazkira_photo',
        'photo',
        'driving_license_photo',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}