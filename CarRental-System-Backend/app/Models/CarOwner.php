<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarOwner extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'address',
    ];

    public function cars()
    {
        return $this->hasMany(Car::class, 'owner_id');
    }

    public function ownerPayments()
    {
        return $this->hasMany(OwnerPayment::class, 'owner_id');
    }
}