<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function create()
    {
        return Inertia::render('OrderForm');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'payment_method' => 'required|string|max:50',
            'cart' => 'required|array',
            'cart.*.product_id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
        ]);

        $total = 0;
        foreach ($validated['cart'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $total += $product->price * $item['quantity'];
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
            'total_amount' => $total,
            'status' => 'pending',
        ]);

        foreach ($validated['cart'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);
        }

       return redirect()->route('orders.thankyou');

    }

    public function show(Order $order)
    {
        $order->load(['items.product', 'user']);
        return Inertia::render('OrderShow', ['order' => $order]);
    }
    
    public function thankyou()
    {
        return Inertia::render('ThankYou');
    }
}


