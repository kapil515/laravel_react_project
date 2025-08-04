<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;

class RazorpayController extends Controller
{
    public function createOrder(Order $order)
    {
        Log::info('Initiating Razorpay payment for order', ['order_id' => $order->id]);
        $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        try {
            $razorpayOrder = $api->order->create([
                'amount' => $order->total_amount * 100, 
                'currency' => 'INR',
                'receipt' => 'order_' . $order->id,
                'payment_capture' => 1,
            ]);
            Log::info('Razorpay order created', ['razorpay_order_id' => $razorpayOrder->id]);

            Payment::create([
                'order_id' => $order->id,
                'payment_method' => 'online',
                'status' => 'pending',
                'transaction_id' => $razorpayOrder->id,
                'payment_response' => json_encode($razorpayOrder->toArray()),
            ]);

            return Inertia::render('RazorpayPayment', [
                'order' => $order->toArray(),
                'razorpay_order_id' => $razorpayOrder->id,
                'razorpay_key' => config('services.razorpay.key'),
                'amount' => $order->total_amount * 100,
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
        if ($order->payment_method !== 'online' || $order->status !== 'pending') {
            Log::warning('Invalid payment retry request', ['order_id' => $order->id, 'payment_method' => $order->payment_method, 'status' => $order->status]);
            return redirect()->route('orders.thankyou', $order->id)->with('error', 'Invalid payment retry request.');
        }

        Log::info('Retrying Razorpay payment for order', ['order_id' => $order->id]);
        $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        try {
            $razorpayOrder = $api->order->create([
                'amount' => $order->total_amount * 100,
                'currency' => 'INR',
                'receipt' => 'order_' . $order->id,
                'payment_capture' => 1,
            ]);
            Log::info('Razorpay retry order created', ['razorpay_order_id' => $razorpayOrder->id]);

            $order->payment()->update([
                'transaction_id' => $razorpayOrder->id,
                'payment_response' => json_encode($razorpayOrder->toArray()),
            ]);

            return Inertia::render('RazorpayPayment', [
                'order' => $order->toArray(),
                'razorpay_order_id' => $razorpayOrder->id,
                'razorpay_key' => config('services.razorpay.key'),
                'amount' => $order->total_amount * 100,
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
        Log::info('Razorpay callback received', ['request' => $request->all(), 'headers' => $request->headers->all()]);

        $attributes = $request->all();
        $requiredFields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'];

        // Validate required fields
        $missingFields = array_filter($requiredFields, fn($field) => !isset($attributes[$field]) || is_null($attributes[$field]));
        if (!empty($missingFields)) {
            Log::error('Invalid Razorpay callback data', [
                'attributes' => $attributes,
                'missing_fields' => $missingFields,
                'request_ip' => $request->ip(),
            ]);

            $order = Order::whereHas('payment', function ($query) use ($attributes) {
                $query->where('transaction_id', $attributes['razorpay_order_id'] ?? '');
            })->first();

            if ($order) {
                $order->update(['status' => 'failed']);
                $order->payment()->update([
                    'status' => 'failed',
                    'payment_response' => json_encode($attributes),
                ]);
                Log::info('Order marked as failed due to invalid callback', ['order_id' => $order->id]);
            }

            return redirect()->route('orders.thankyou', $order ? $order->id : 0)
                ->with('error', 'Payment failed: Missing or invalid payment data (' . implode(', ', $missingFields) . ').');
        }

        $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        try {
            $api->utility->verifyPaymentSignature([
                'razorpay_order_id' => $attributes['razorpay_order_id'],
                'razorpay_payment_id' => $attributes['razorpay_payment_id'],
                'razorpay_signature' => $attributes['razorpay_signature'],
            ]);

            $order = Order::whereHas('payment', function ($query) use ($attributes) {
                $query->where('transaction_id', $attributes['razorpay_order_id']);
            })->firstOrFail();

            $order->update(['status' => 'completed']);
            $order->payment()->update([
                'status' => 'completed',
                'payment_response' => json_encode($attributes),
            ]);

            Log::info('Razorpay payment successful', ['order_id' => $order->id, 'payment_id' => $attributes['razorpay_payment_id']]);

            return redirect()->route('orders.thankyou', $order->id)->with('success', 'Payment successful!');
        } catch (\Exception $e) {
            Log::error('Razorpay payment verification failed', [
                'error' => $e->getMessage(),
                'attributes' => $attributes,
                'request_ip' => $request->ip(),
            ]);

            $order = Order::whereHas('payment', function ($query) use ($attributes) {
                $query->where('transaction_id', $attributes['razorpay_order_id']);
            })->first();

            if ($order) {
                $order->update(['status' => 'failed']);
                $order->payment()->update([
                    'status' => 'failed',
                    'payment_response' => json_encode($attributes),
                ]);
            }

            return redirect()->route('orders.thankyou', $order ? $order->id : 0)
                ->with('error', 'Payment failed: ' . $e->getMessage());
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