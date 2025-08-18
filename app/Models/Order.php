<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;
use App\Notifications\OrderStatusUpdated;


class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'postal_code',
        'country',
        'payment_method',
        'total_amount',
        'shipping_fee',
        'currency',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function payment()
{
    return $this->hasOne(Payment::class);

}

public function trackingEvents()
{
    return $this->hasMany(OrderTracking::class)->orderBy('reported_at');
}


public function latestTracking()
{
    return $this->hasOne(OrderTracking::class)->latestOfMany();
}

    protected static function booted()
{
    static::created(function ($order) {
        $order->order_number = '#ORD' . str_pad($order->id, 3,'0', STR_PAD_LEFT) . strtoupper(Str::random(3));
        $order->save();
    });
}

}


