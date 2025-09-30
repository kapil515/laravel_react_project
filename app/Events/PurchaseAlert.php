<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class PurchaseAlert implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $alert;

    public function __construct($alert)
    {
        $this->alert = $alert;
    }

    public function broadcastOn()
    {
        return new Channel('public.purchase-alerts');
    }

    public function broadcastWith()
    {
        return $this->alert;
    }
}