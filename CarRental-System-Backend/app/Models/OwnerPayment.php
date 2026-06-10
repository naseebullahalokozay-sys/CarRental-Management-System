<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OwnerPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'amount_paid',
        'payment_date',
        'remaining_balance',
        'receipt_no',
    ];

    protected $casts = [
        'amount_paid'       => 'decimal:2',
        'remaining_balance' => 'decimal:2',
        'payment_date'      => 'date',
    ];

    public function owner()
    {
        return $this->belongsTo(CarOwner::class, 'owner_id');
    }
}