<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\CartItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    public function orders()
    {
        if (auth()->user()->role !== 'admin') {
            Log::warning('Unauthorized access attempt to orders dashboard', ['user_id' => auth()->id()]);
            abort(403, 'Unauthorized');
        }

        $orders = Order::with(['items.product', 'user', 'payment'])
            ->latest()
            ->paginate(8)
            ->through(function ($order) {
                $order->items->map(function ($item) {
                    $images = is_string($item->product->images)
                        ? json_decode($item->product->images, true)
                        : ($item->product->images ?? []);

                    $item->product->images = collect($images)->map(function ($image) {
                        return Storage::url($image);
                    });
                });
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? 'ORD-' . $order->id,
                    'user' => $order->user ? [
                        'name' => $order->user->name,
                        'email' => $order->user->email,
                        'role' => $order->user->role,
                        'phone' => $order->user->phone ?? 'N/A',
                    ] : null,
                    'items' => $order->items,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'payment_method' => $order->payment_method,
                    'payment' => $order->payment,
                    'shipping_fee' => $order->shipping_fee,
                ];
            });

        Log::info('Orders retrieved for dashboard', ['total' => $orders->total(), 'user_id' => auth()->id()]);

        return Inertia::render('Dashboard', [
            'section' => 'orders',
            'orders' => $orders,
            'transactions' => $orders,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'address_line1' => 'required|max:255',
            'address_line2' => 'nullable|max:255',
            'city' => 'required|max:255',
            'state' => 'required|max:255',
            'postal_code' => 'required|max:20',
            'country' => 'required|max:100',
            'payment_method' => 'required|in:cod,credit_card,gpay,online',
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

        if ($request['payment_method'] === 'online' && $totalAmount < 1) {
            return redirect()->back()->with('error', 'Order amount must be at least 1 INR for Razorpay payments.');
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'order_number' => 'ORD-' . time() . '-' . Auth::id(),
            'address_line1' => $request['address_line1'],
            'address_line2' => $request['address_line2'],
            'city' => $request['city'],
            'state' => $request['state'],
            'postal_code' => $request['postal_code'],
            'country' => $request['country'],
            'payment_method' => $request['payment_method'],
             'status' => 'pending',
            'total_amount' => $totalAmount,
            'shipping_fee' => $shippingFee,
        ]);

        foreach ($request['cart'] as $item) {
            $product = Product::findOrFail($item['id']);
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);
        }

        Log::info('Order created', ['order_id' => $order->id, 'payment_method' => $request['payment_method']]);

        if ($request['payment_method'] === 'cod') {
            $order->update(['status' => 'pending']);
            return redirect()->route('orders.thankyou', ['order' => $order->id]);
        }

        if ($request['payment_method'] === 'online') {
            return app(RazorpayController::class)->createOrder($order);
        }
    }

    public function show(Order $order)
{
    $order->load(['items.product', 'user', 'payment']);

    return Inertia::render('ThankYou', [
        'order' => $order->toArray() + [
            'shipping_fee' => $order->shipping_fee,
            'transaction_id' => optional($order->payment)->transaction_id,
        ],
    ]);
}


    public function adminShow(Order $order)
    {
        if (auth()->user()->role !== 'admin') {
            Log::warning('Unauthorized access attempt to order details', ['order_id' => $order->id, 'user_id' => auth()->id()]);
            abort(403, 'Unauthorized');
        }

        $order->load(['items.product.category', 'items.product.subcategory', 'user']);

        foreach ($order->items as $item) {
            $images = is_string($item->product->images)
                ? json_decode($item->product->images, true)
                : ($item->product->images ?? []);

            $item->product->images = collect($images)->map(function ($image) {
                return Storage::url($image);
            });
        }

        return Inertia::render('Dashboard', [
            'section' => 'order-details',
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number ?? 'ORD-' . $order->id,
                'user' => $order->user ? [
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                    'role' => $order->user->role,
                    'phone' => $order->user->phone ?? 'N/A',
                ] : null,
                'items' => $order->items,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'payment_method' => $order->payment_method,
                'shipping_fee' => $order->shipping_fee,
                'address' => [
                    'address_line1' => $order->address_line1,
                    'address_line2' => $order->address_line2 ?? 'N/A',
                    'city' => $order->city,
                    'state' => $order->state,
                    'postal_code' => $order->postal_code,
                    'country' => $order->country,
                ],
            ],
        ]);
    }

    public function destroy(string $id)
    {
        if (auth()->user()->role !== 'admin') {
            Log::warning('Unauthorized attempt to delete order', ['order_id' => $id, 'user_id' => auth()->id()]);
            abort(403, 'Unauthorized');
        }

        $order = Order::findOrFail($id);
        $order->delete();

        return redirect()->route('dashboard.orders')->with('success', 'Order deleted successfully.');
    }

    public function massDestroy(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            Log::warning('Unauthorized attempt to mass delete orders', ['user_id' => auth()->id()]);
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
        ]);

        Order::whereIn('id', $request->order_ids)->delete();

        return redirect()->route('dashboard.orders')->with('success', 'All selected orders deleted successfully.');
    }


public function singledelete($id)
{
    $order = Order::findOrFail($id);
    $order->delete();

    return redirect()->back()->with('success', 'Transaction deleted successfully.');
}

public function multipleDelete(Request $request)
{
    $request->validate([
        'transaction_ids' => 'required|array',
        'transaction_ids.*' => 'exists:orders,id',
    ]);

    Order::whereIn('id', $request->transaction_ids)->delete();

    return redirect()->back()->with('success', 'Selected transactions deleted successfully.');
}

}