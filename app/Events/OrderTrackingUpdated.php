<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use App\Models\OrderTracking;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class OrderTrackingUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

     public $tracking;
    /**
     * Create a new event instance.
     */
    public function __construct(OrderTracking $tracking)
    {
        // pass array (avoid lazy-loading later)
        $this->tracking = $tracking->toArray();
    }

    public function broadcastOn()
    {
        // private channel per order
        return new PrivateChannel('order.' . $this->tracking['order_id']);
    }

    public function broadcastWith()
    {
        return [
            'tracking' => $this->tracking,
        ];
    }
}
