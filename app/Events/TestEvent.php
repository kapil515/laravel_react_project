<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct($message = "Hello from Laravel!")
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new Channel('test-channel'); // matches frontend subscribe
    }

    public function broadcastAs()
    {
        return 'TestEvent'; // matches frontend bind
    }
}
