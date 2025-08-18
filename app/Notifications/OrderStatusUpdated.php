<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;

class OrderStatusUpdated extends Notification
{
    use Queueable;

    protected $order;
    protected $newStatus;
    protected $trackingEvent;

    public function __construct($order, $newStatus, $trackingEvent = null)
    {
        $this->order = $order;
        $this->newStatus = $newStatus;
        $this->trackingEvent = $trackingEvent;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
            ->subject('Order Status Update for Order #' . ($this->order->order_number ?? $this->order->id))
            ->greeting('Hello ' . ($this->order->user->name ?? 'Customer') . ',')
            ->line('Your order has been updated to the following status: **' . str_replace('_', ' ', $this->newStatus) . '**')
            ->line($this->getStatusMessage($this->newStatus))
            ->lineIf($this->newStatus === 'out_for_delivery' || $this->newStatus === 'delivered', $this->getDeliveryDetails())
            ->action('Track Your Order', url('/orders/' . $this->order->id . '/track' ))
            ->line('Thank you for shopping with us!');

        if ($this->trackingEvent && $this->trackingEvent->location_text) {
            $mail->line('Location: ' . $this->trackingEvent->location_text);
        }

        return $mail;
    }

    protected function getStatusMessage($status)
    {
        $messages = [
            'packed' => 'Your order has been packed and will be shipped soon.',
            'shipped' => 'Your order has been shipped.',
            'out_for_delivery' => 'Your order is out for delivery and will reach you soon.',
            'delivered' => 'Your order has been delivered. Enjoy!',
            'canceled' => 'Your order has been canceled.',
        ];
        return $messages[$status] ?? 'Status updated.';
    }

    protected function getDeliveryDetails()
    {
        if ($this->trackingEvent && ($this->trackingEvent->deliveryman_name || $this->trackingEvent->deliveryman_phone)) {
            return 'Delivery Partner: ' . ($this->trackingEvent->deliveryman_name ?? 'N/A') . 
                   ($this->trackingEvent->deliveryman_phone ? ' | Phone: ' . $this->trackingEvent->deliveryman_phone : '');
        }
        return '';
    }
}