<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {

        $request->validate([
            'address_line1' => 'required|max:255',
            'address_line2' => 'nullable|max:255',
            'city' => 'required|max:255',
            'state' => 'required|max:255',
            'postal_code' => 'required|max:20',
            'country' => 'required|max:100',
            'payment_method' => 'required|in:cod,credit_card,gpay,online,paypal',
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
        ]);

        $totalAmount = 0;
        foreach ($request['cart'] as $item) {
            $product = Product::findOrFail($item['id']);
            $totalAmount += $product->price * $item['quantity'];
        }

        $shippingFee = $request['payment_method'] === 'cod' ? 50 : 30;
        $totalAmount += $shippingFee;

        // Create Order
        $order = Order::create([
            'user_id'        => Auth::id(),
            'order_number'   => 'ORD-' . time() . '-' . Auth::id(),
            'address_line1'  => $request['address_line1'],
            'address_line2'  => $request['address_line2'],
            'city'           => $request['city'],
            'state'          => $request['state'],
            'postal_code'    => $request['postal_code'],
            'country'        => $request['country'],
            'payment_method' => $request['payment_method'],
            'status'         => 'pending',
            'total_amount'   => $totalAmount,
            'shipping_fee'   => $shippingFee,
        ]);

        // Create Order Items
        foreach ($request['cart'] as $item) {
            $product = Product::findOrFail($item['id']);
            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $product->id,
                'quantity'   => $item['quantity'],
                'price'      => $product->price,
            ]);
        }

        Log::info('Order created', [
            'order_id'          => $order->id,
            'payment_method'    => $request['payment_method'],
            'payment_method_id' => $request->get('payment_method_id'),
        ]);

        // Handle Different Payment Methods
        if ($request['payment_method'] === 'cod') {
            return redirect()->route('orders.thankyou', ['order' => $order->id]);
        }

        if ($request['payment_method'] === 'online') {
            return app(RazorpayController::class)->createOrder($order);
        }

        if ($request['payment_method'] === 'stripe') {
            return app(Api\CheckoutController::class)->processStripePayment($request, $order);
        }
        if ($request->payment_method === 'paypal') {
            $paypalUrl = app(PayPalController::class)->createOrder($order);

            if ($paypalUrl) {
                return Inertia::render('OrderForm', [
                    'redirect_to' => $paypalUrl,
                ]);
            }
        }

        return redirect()->route('payment.credit', ['order' => $order->id]);
    }

    // Rest of your methods remain the same...
    public function show(Order $order)
    {
        $order->load(['items.product', 'user', 'payment']);
        $order->load(['items.product', 'user']);
        return Inertia::render('ThankYou', ['order' => $order->toArray() + [
            'shipping_fee' => $order->shipping_fee,
            'flash'        => session('flash', []),
        ]]);

        return Inertia::render('ThankYou', [
            'order' => $order->toArray() + [
                'shipping_fee'   => $order->shipping_fee,
                'transaction_id' => optional($order->payment)->transaction_id,
            ],
        ]);
    }
}
