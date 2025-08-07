<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentIntent;

class CheckoutController extends Controller
{
    public function processStripePayment($request, $order)
    {

        try {
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
            Log::info('Processing Stripe payment', [
                'order_id'          => $order->id,
                'amount'            => $order->total_amount,
                'payment_method_id' => $request->payment_method_id,
            ]);

            $paymentIntent = PaymentIntent::create([
                'amount'              => intval($order->total_amount * 100), // Convert to cents
                'currency'            => 'usd',
                'payment_method'      => $request->payment_method_id,
                'confirmation_method' => 'manual',
                'confirm'             => true,
                'return_url'          => route('orders.thankyou', ['order' => $order->id]),
                'metadata'            => [
                    'order_id' => $order->id,
                    'user_id'  => Auth::id(),
                ],
            ]);

            Log::info('Stripe PaymentIntent created', [
                'payment_intent_id' => $paymentIntent->id,
                'status'            => $paymentIntent->status,
            ]);

            if ($paymentIntent->status === 'succeeded') {
                $order->update(['status' => 'completed']);

                return redirect()->route('orders.thankyou', ['order' => $order->id])
                    ->with('success', 'Payment successful!');
            }

            if ($paymentIntent->status === 'requires_action') {
                return response()->json([
                    'requires_action' => true,
                    'payment_intent'  => [
                        'id'            => $paymentIntent->id,
                        'client_secret' => $paymentIntent->client_secret,
                    ],
                ]);
            }

            return back()->withErrors(['payment' => 'Payment failed. Please try again.']);

        } catch (\Stripe\Exception\CardException $e) {
            Log::error('Stripe Card Error', [
                'message'  => $e->getMessage(),
                'order_id' => $order->id,
            ]);
            return back()->withErrors(['payment_method_id' => $e->getMessage()]);

        } catch (\Stripe\Exception\InvalidRequestException $e) {
            Log::error('Stripe Invalid Request', [
                'message'  => $e->getMessage(),
                'order_id' => $order->id,
            ]);
            return back()->withErrors(['payment_method_id' => 'Invalid payment information: ' . $e->getMessage()]);

        } catch (\Exception $e) {
            Log::error('Stripe Payment Error', [
                'message'  => $e->getMessage(),
                'order_id' => $order->id,
                'trace'    => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['payment' => 'Payment processing failed: ' . $e->getMessage()]);
        }
    }

}
