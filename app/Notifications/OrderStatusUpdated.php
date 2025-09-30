<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Order;

class OrderStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;
    protected $status;

    public function __construct(Order $order, string $status)
    {
        $this->order = $order;
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['mail', 'database', 'broadcast'];
}


    public function toMail($notifiable)
    {
        $statusMessages = [
            'pending' => 'Your order has been successfully placed!',
            'processing' => 'Your order is now being processed.',
            'shipped' => 'Good news! Your order has been shipped.',
            'out_for_delivery' => 'Your order is out for delivery and will be delivered by 9 PM today.',
            'delivered' => 'Your order has been successfully delivered!',
        ];

        return (new MailMessage)
            ->subject('Order Status Update - #' . $this->order->order_number)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line($statusMessages[$this->status] ?? 'Your order status has been updated.')
            ->line('Order Number: #' . $this->order->order_number)
            ->action('View Order', route('orders.show', $this->order->id))
            ->line('Thank you for shopping with us!');
    }

    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'status' => $this->status,
            'message' => 'Your order #' . $this->order->order_number . ' status has been updated to ' . $this->status,
        ];
    }
}