<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{

    public function process(Request $request, Order $order)
    {
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        $request->validate([
            'payment_method_id' => 'required|string',
        ]);

        $total = $order->total_amount;

        try {
            $paymentIntent = \Stripe\PaymentIntent::create([
                'amount'              => intval($total * 100),
                'currency'            => 'usd',
                'payment_method'      => $request->payment_method_id,
                'confirmation_method' => 'manual',
                'confirm'             => true,
                'metadata'            => [
                    'order_id' => $order->id,
                    'user_id'  => $order->user_id,
                ],
            ]);

            if ($paymentIntent->status === 'succeeded') {
                $order->update(['status' => 'completed']);
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

}
