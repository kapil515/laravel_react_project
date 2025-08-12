<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CartItem;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;

class RazorpayController extends Controller
{
   private function convertToINR($amount, $currency)
{
    Log::info('convertToINR called', [
        'amount' => $amount,
        'currency' => $currency,
        'rate_from_config' => config('services.currency_rates.USD_TO_INR'),
    ]);

    if ($currency === 'USD') {
        $rate = config('services.currency_rates.USD_TO_INR');
        if (!$rate) {
            Log::error('USD_TO_INR rate not found or zero');
            return $amount;
        }
        return $amount * $rate;
    }
    
    return $amount;
}

    public function createOrder(Order $order)
    {
        Log::info('Initiating Razorpay payment for order', ['order_id' => $order->id]);
    $currency = $order->currency ?? 'INR'; 
        $amountInINR = $this->convertToINR($order->total_amount, $currency);

        // Debug log for conversion
        Log::info('Amount conversion debug', [
            'original_amount' => $order->total_amount,
            'currency' => $currency,
            'amountInINR' => $amountInINR,
            'amountForRazorpay' => intval(round($amountInINR * 100)),
        ]);

        $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        try {
            $razorpayOrder = $api->order->create([
               'amount' => intval(round($amountInINR * 100)),
                'currency' => 'INR',
                'receipt' => 'order_' . $order->id,
                'payment_capture' => 1,
            ]);
            Log::info('Razorpay order created', ['razorpay_order_id' => $razorpayOrder->id]);

            Payment::create([
                'order_id' => $order->id,
                'payment_method' => 'Razorpay',
                'status' => 'pending',
                'transaction_id' => $razorpayOrder->id,
                'payment_response' => json_encode($razorpayOrder->toArray()),
            ]);

            return Inertia::render('RazorpayPayment', [
                'order' => $order->toArray(),
                'razorpay_order_id' => $razorpayOrder->id,
                'razorpay_key' => config('services.razorpay.key'),
                'amount' => intval(round($amountInINR * 100)),
                'currency' => 'INR',
                'user' => Auth::user()->toArray(),
            ]);
        } catch (\Exception $e) {
            Log::error('Razorpay order creation failed', ['error' => $e->getMessage(), 'order_id' => $order->id]);
            return redirect()->route('orders.thankyou', $order->id)->with('error', 'Failed to initiate Razorpay payment: ' . $e->getMessage());
        }
    }

    public function retryPayment(Order $order)
    {
        if ($order->status !== 'pending') {
            Log::warning('Invalid payment retry request', ['order_id' => $order->id, 'status' => $order->status]);
            return redirect()->route('orders.thankyou', $order->id)->with('error', 'Invalid payment retry request.');
        }

        Log::info('Retrying Razorpay payment for order', ['order_id' => $order->id]);
        $currency = $order->currency ?? 'INR'; 
        $amountInINR = $this->convertToINR($order->total_amount, $currency);

        // Debug log for conversion retry
        Log::info('Amount conversion debug (retry)', [
            'original_amount' => $order->total_amount,
            'currency' => $currency,
            'amountInINR' => $amountInINR,
            'amountForRazorpay' => intval(round($amountInINR * 100)),
        ]);
        $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        try {
            $razorpayOrder = $api->order->create([
               'amount' => intval(round($amountInINR * 100)), 
                'currency' => 'INR',
                'receipt' => 'order_' . $order->id,
                'payment_capture' => 1,
            ]);
            Log::info('Razorpay retry order created', ['razorpay_order_id' => $razorpayOrder->id]);

            if ($order->payment_method === 'cod') {
                $order->update(['payment_method' => 'Razorpay']);
                Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => 'Razorpay',
                    'status' => 'pending',
                    'transaction_id' => $razorpayOrder->id,
                    'payment_response' => json_encode($razorpayOrder->toArray()),
                ]);
            } else {
                $order->payment()->update([
                    'transaction_id' => $razorpayOrder->id,
                    'payment_response' => json_encode($razorpayOrder->toArray()),
                ]);
            }

            return Inertia::render('RazorpayPayment', [
                'order' => $order->toArray(),
                'razorpay_order_id' => $razorpayOrder->id,
                'razorpay_key' => config('services.razorpay.key'),
               'amount' => intval(round($amountInINR * 100)),
                'currency' => 'INR',
                'user' => Auth::user()->toArray(),
            ]);
        } catch (\Exception $e) {
            Log::error('Razorpay retry order creation failed', ['error' => $e->getMessage(), 'order_id' => $order->id]);
            return redirect()->route('orders.thankyou', $order->id)->with('error', 'Failed to retry Razorpay payment: ' . $e->getMessage());
        }
    }

  public function callback(Request $request)
    {
        Log::info('Razorpay Callback Raw:', [
            'data' => $request->all(),
            'headers' => $request->headers->all(),
        ]);

        $attributes = $request->all();

        $requiredFields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'];
        $missingFields = array_filter($requiredFields, fn($field) => empty($attributes[$field]));

        if (!empty($missingFields)) {
            Log::error('Missing Razorpay fields', [
                'missing' => $missingFields,
                'attributes' => $attributes,
            ]);

            $order = Order::whereHas('payment', function ($q) use ($attributes) {
                $q->where('transaction_id', $attributes['razorpay_order_id'] ?? '');
            })->first();

            if ($order) {
                $order->update(['status' => 'failed']);
                $order->payment()->update([
                    'status' => 'failed',
                    'payment_response' => json_encode($attributes),
                ]);
            }

            return redirect()->route('orders.thankyou', $order ? $order->id : 0)
                ->with('error', 'Payment failed: Missing or invalid payment data.');
        }

        $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        try {
            $api->utility->verifyPaymentSignature([
                'razorpay_order_id' => $attributes['razorpay_order_id'],
                'razorpay_payment_id' => $attributes['razorpay_payment_id'],
                'razorpay_signature' => $attributes['razorpay_signature'],
            ]);

            $order = Order::whereHas('payment', function ($q) use ($attributes) {
                $q->where('transaction_id', $attributes['razorpay_order_id']);
            })->firstOrFail();

            $order->update(['status' => 'completed']);
            $order->payment()->update([
                'status' => 'completed',
                'payment_response' => json_encode($attributes),
            ]);
                CartItem::where('user_id', $order->user_id)
    ->whereIn('product_id', $order->items->pluck('product_id'))
    ->delete();

            Log::info('Payment successful', [
                'order_id' => $order->id,
                'payment_id' => $attributes['razorpay_payment_id'],
            ]);

            return redirect()->route('orders.thankyou', $order->id)->with('success', 'Payment successful!');
        } catch (\Exception $e) {
            Log::error('Razorpay verification failed', [
                'error' => $e->getMessage(),
                'attributes' => $attributes,
            ]);

            $order = Order::whereHas('payment', function ($q) use ($attributes) {
                $q->where('transaction_id', $attributes['razorpay_order_id']);
            })->first();

            if ($order) {
                $order->update(['status' => 'failed']);
                $order->payment()->update([
                    'status' => 'failed',
                    'payment_response' => json_encode($attributes),
                ]);
            }

            return redirect()->route('orders.thankyou', $order ? $order->id : 0)
                ->with('error', 'Payment verification failed: ' . $e->getMessage());
        }
    }

    public function debug()
    {
        $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
        try {
            $testOrder = $api->order->create([
                'amount' => 100, 
                'currency' => 'INR',
                'receipt' => 'test_order_' . time(),
                'payment_capture' => 1,
            ]);
            Log::info('Debug Razorpay order created', ['razorpay_order_id' => $testOrder->id]);
            return response()->json(['status' => 'success', 'razorpay_order_id' => $testOrder->id]);
        } catch (\Exception $e) {
            Log::error('Debug Razorpay order creation failed', ['error' => $e->getMessage()]);
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}