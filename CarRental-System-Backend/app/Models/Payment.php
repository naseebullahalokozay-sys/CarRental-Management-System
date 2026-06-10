<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_id',
        'amount_paid',
        'remaining_balance',
        'payment_date',
        'payment_method',
    ];

    protected $casts = [
        'amount_paid'       => 'decimal:2',
        'remaining_balance' => 'decimal:2',
        'payment_date'      => 'date',
    ];

    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }
}