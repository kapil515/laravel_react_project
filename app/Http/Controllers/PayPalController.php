<?php

namespace App\Http\Controllers;

use App\Models\Order;
use GuzzleHttp\Client;
use App\Models\Payment;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Exception\RequestException;

class PayPalController extends Controller
{
    /**
     * Create a PayPal order and redirect to approval URL
     */
   public function createOrder(Order $order)
{
    try {
        $client = new \GuzzleHttp\Client(['timeout' => 10]);
        $accessToken = $this->getPaypalAccessToken();

        $response = $client->post(env('PAYPAL_API_URL') . '/v2/checkout/orders', [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'amount' => [
                        'currency_code' => 'USD',
                        'value' => number_format($order->total_amount, 2, '.', ''),
                    ],
                    'description' => 'Order #' . $order->order_number,
                ]],
                'application_context' => [
                    'return_url' => route('paypal.success', ['order' => $order->id]),
                    'cancel_url' => route('paypal.cancel', ['order' => $order->id]),
                ],
            ],
        ]);

        $data = json_decode($response->getBody()->getContents(), true);
        $approvalUrl = collect($data['links'])->firstWhere('rel', 'approve')['href'];

        Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'paypal',
            'transaction_id' => $data['id'],
            'status' => 'Approved',
            'amount' => $order->total_amount,
        ]);

        return $approvalUrl;

    } catch (\Throwable $e) {
        \Log::error('PayPal Order Error', [
            'error' => $e->getMessage()
        ]);
        return null;
    }
}


    /**
     * Get PayPal access token
     */
protected function getPaypalAccessToken()
{
    $client = new \GuzzleHttp\Client();

    $response = $client->post(env('PAYPAL_API_URL') . '/v1/oauth2/token', [
        'auth' => [
            env('PAYPAL_SANDBOX_CLIENT_ID'),
            env('PAYPAL_SANDBOX_CLIENT_SECRET')
        ],
        'form_params' => [
            'grant_type' => 'client_credentials',
        ],
    ]);

    $data = json_decode($response->getBody()->getContents(), true);

    return $data['access_token'];
}


    /**
     * Handle PayPal payment success
     */
    public function success($id, Request $request)
{
    try {
        // Get token and payer ID from the request
        $token = $request->query('token');
        $payerID = $request->query('PayerID');
        
        // Find the order
        $order = Order::findOrFail($id);
        
        // Capture the payment
        $captureResult = $this->capturePayment($token);
        
        if ($captureResult && $captureResult['status'] === 'COMPLETED') {
            // Update order status
            $order->update(['status' => 'completed']);
            
            // Update payment record
            Payment::where('order_id', $order->id)
                ->where('payment_method', 'paypal')
                ->update([
                    'status' => 'completed',
                    'transaction_id' => $captureResult['id'] ?? $token
                ]);

                CartItem::where('user_id', auth()->id())->delete();
            
            Log::info('PayPal payment completed successfully', [
                'order_id' => $order->id,
                'transaction_id' => $captureResult['id'] ?? $token
            ]);
            
            // Redirect to thank you page
            return redirect()->route('orders.thankyou', ['order' => $order->id])
                ->with('success', 'Payment completed successfully!');
        } else {
            // Payment failed
            $order->update(['status' => 'failed']);
            
            Payment::where('order_id', $order->id)
                ->where('payment_method', 'paypal')
                ->update(['status' => 'failed']);
            
            Log::error('PayPal payment capture failed', [
                'order_id' => $order->id,
                'token' => $token
            ]);
            
            return redirect()->route('cart.index')
                ->with('error', 'Payment failed. Please try again.');
        }
        
    } catch (\Throwable $e) {
        Log::error('PayPal payment processing error', [
            'order_id' => $id,
            'error' => $e->getMessage()
        ]);
        
        return redirect()->route('cart.index')
            ->with('error', 'An error occurred while processing your payment.');
    }
}

/**
 * Capture PayPal payment
 */
private function capturePayment($token)
{
    try {
        $client = new \GuzzleHttp\Client(['timeout' => 10]);
        $accessToken = $this->getPaypalAccessToken();
        
        $response = $client->post(env('PAYPAL_API_URL') . '/v2/checkout/orders/' . $token . '/capture', [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
            ],
        ]);
        
        $data = json_decode($response->getBody()->getContents(), true);
        
        return [
            'status' => $data['status'],
            'id' => $data['id'] ?? null
        ];
        
    } catch (\Throwable $e) {
        Log::error('PayPal capture payment error', [
            'token' => $token,
            'error' => $e->getMessage()
        ]);
        return null;
    }
}

    /**
     * Handle PayPal payment cancellation
     */
    public function cancelTransaction(Request $request, Order $order)
    {
        return redirect()->route('cart.index')->with('error', 'Payment was pending.');
    }
}