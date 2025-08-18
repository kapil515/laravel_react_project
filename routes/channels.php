<?php

use App\Models\Order;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('order.{orderId}', function ($user, $orderId) {
    return $user->id === Order::find($orderId)->user_id || $user->role === 'admin';
});

