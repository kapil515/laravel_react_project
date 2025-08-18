<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderTracking extends Model
{
     use HasFactory;

    protected $table = 'order_tracking';

    protected $fillable = [
        'order_id',
        'location_text',
        'latitude',
        'longitude',
        'status',
        'tracking_provider',
        'tracking_id',
        'deliveryman_name',  
        'deliveryman_phone',
        'note',
        'external_event_id',
        'reported_at',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'reported_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
