<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


class OrderController extends Controller
{
   public function create()
{
    $cartItems = CartItem::with('product')
        ->where('user_id', Auth::id())
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->product_id,
                'quantity' => $item->quantity,
            ];
        });

    return Inertia::render('OrderForm', [
        'cartItems' => $cartItems,
    ]);
}


public function store(Request $request)
{
    $validated = $request->validate([
    'address_line1' => 'required|string|max:255',
    'address_line2' => 'required|string|max:255',
    'city' => 'required|string|max:255',
    'state' => 'required|string|max:255',
    'postal_code' => 'required|string|max:20',
    'country' => 'required|string|max:100',
    'payment_method' => 'required|string|max:50',
    'cart' => 'required|array|min:1',
]);

$totalAmount = 0;

foreach ($validated['cart'] as $item) {
    $product = Product::findOrFail($item['id']);
    $totalAmount += $product->price * $item['quantity'];
}

$order = Order::create([
    'user_id' => Auth::id(),
    'address_line1' => $validated['address_line1'],
    'address_line2' => $validated['address_line2'],
    'city' => $validated['city'],
    'state' => $validated['state'],
    'postal_code' => $validated['postal_code'],
    'country' => $validated['country'],
    'payment_method' => $validated['payment_method'],
    'status' => 'pending',
    'total_amount' => $totalAmount, 
]);

foreach ($validated['cart'] as $item) {
    $product = Product::findOrFail($item['id']);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => $item['quantity'],
        'price' => $product->price,
    ]);
}

 CartItem::where('user_id', Auth::id())
        ->whereIn('product_id', collect($validated['cart'])->pluck('id'))
        ->delete();
        
    \Log::info('Order created', ['order_id' => $order->id]);

    return redirect()->route('orders.thankyou', ['order' => $order->id]);

}


    public function show(Order $order)
    {
        $order->load(['items.product', 'user']);
        return Inertia::render('ThankYou', ['order' => $order]);
    }
    
}


