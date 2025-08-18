<?php

namespace App\Events;

use App\Models\Order;
use App\Models\OrderTracking;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class OrderTrackingUpdated implements ShouldBroadcast
{
    use SerializesModels;

    public Order $order;
    public string $status;
    public ?string $note;
    public ?string $deliveryman_name;
    public ?string $deliveryman_phone;
    public ?string $location_text;

    public function __construct(
        Order $order,
        string $status,
        ?string $note = null,
        ?string $deliveryman_name = null,
        ?string $deliveryman_phone = null,
        ?string $location_text = null
    ) {
        $this->order = $order->withoutRelations();
        $this->status = $status;
        $this->note = $note;
        $this->deliveryman_name = $deliveryman_name;
        $this->deliveryman_phone = $deliveryman_phone;
        $this->location_text = $location_text;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('order.' . $this->order->id);
    }

    public function broadcastAs()
    {
        return 'OrderTrackingUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id'          => $this->order->id,
            'order_number'      => $this->order->order_number,
            'status'            => $this->status,
            'note'              => $this->note,
            'deliveryman_name'  => $this->deliveryman_name,
            'deliveryman_phone' => $this->deliveryman_phone,
            'location_text'     => $this->location_text,
            'reported_at'       => now()->toDateTimeString(),
        ];
    }
}
