<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Inertia\Inertia;

class StripeController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        $order = Order::findOrFail($request->order_id);

        Log::info('Creating Stripe Checkout Session', [
            'order_id' => $order->id,
            'total_amount' => $order->total_amount,
            'user_id' => Auth::id(),
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            if ($order->status !== 'pending') {
                return redirect()->route('orders.thankyou', $order->id)
                    ->with('error', 'Order is not pending.');
            }

            if ($order->total_amount < 0.50) {
                return redirect()->route('orders.thankyou', $order->id)
                    ->with('error', 'Order amount must be at least $0.50 for Stripe payments.');
            }

            $lineItems = $order->items->map(function ($item) {
                return [
                    'price_data' => [
                        'currency' => 'Inr',
                        'product_data' => [
                            'name' => $item->product->name,
                        ],
                        'unit_amount' => intval($item->price * 100),
                    ],
                    'quantity' => $item->quantity,
                ];
            })->toArray();

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'Inr',
                    'product_data' => [
                        'name' => 'Shipping Fee',
                    ],
                    'unit_amount' => intval($order->shipping_fee * 100),
                ],
                'quantity' => 1,
            ];

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => route('checkout.success', ['order' => $order->id]) . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('checkout.cancel', ['order' => $order->id]),
                'metadata' => [
                    'order_id' => $order->id,
                    'user_id' => $order->user_id,
                ],
            ]);

            Payment::create([
                'order_id' => $order->id,
                'payment_method' => 'stripe',
                'status' => 'pending',
                'transaction_id' => $session->id,
                'payment_response' => json_encode($session->toArray()),
            ]);

            Log::info('Checkout Session created', ['session_id' => $session->id]);

            return Inertia::location($session->url);
        } catch (\Exception $e) {
            Log::error('Checkout Session creation failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            return redirect()->route('orders.thankyou', $order->id)
                ->with('error', 'Failed to initiate Stripe Checkout: ' . $e->getMessage());
        }
    }

    public function success(Request $request, Order $order)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $session = Session::retrieve($request->query('session_id'));

            if ($session->payment_status === 'paid' && $session->metadata->order_id == $order->id) {
                $order->update(['status' => 'completed']);
                $order->payment()->update([
                    'status' => 'completed',
                    'payment_response' => json_encode($session->toArray()),
                ]);

                CartItem::where('user_id', $order->user_id)
                    ->whereIn('product_id', $order->items->pluck('product_id'))
                    ->delete();

                Log::info('Payment successful', [
                    'order_id' => $order->id,
                    'session_id' => $session->id,
                ]);

                 return redirect()->route('orders.thankyou', ['order' => $order->id])
                    ->with('success', 'Payment  completed.');

            } else {
                Log::warning('Payment not completed', [
                    'order_id' => $order->id,
                    'session_id' => $session->id,
                    'status' => $session->payment_status,
                ]);
                return redirect()->route('checkout.cancel', ['order' => $order->id])
                    ->with('error', 'Payment not completed.');
            }
        } catch (\Exception $e) {
            Log::error('Success handler error', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            return redirect()->route('checkout.cancel', ['order' => $order->id])
                ->with('error', 'Payment verification failed: ' . $e->getMessage());
        }
    }

    public function cancel(Request $request, Order $order)
    {
        Log::info('Payment canceled', ['order_id' => $order->id]);
        $order->update(['status' => 'canceled']);
        $order->payment()->update(['status' => 'canceled']);

        return Inertia::render('Cancel', [
            'orderId' => $order->id,
            'message' => 'Payment was canceled. You can retry the payment or return to the cart.',
            'retryUrl' => route('orders.store'),
            'cartUrl' => route('cart.index'),
        ]);
    }
}