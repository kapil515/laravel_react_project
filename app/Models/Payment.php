<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'payment_method',
        'status',
        'transaction_id',
        'payment_response',
    ];

    protected $casts = [
        'payment_response' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
