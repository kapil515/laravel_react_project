<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Redirect;

class CartController extends Controller
{
   public function add(Request $request)
{
    $productId = $request->input('product_id');
    $quantity = $request->input('quantity', 1);

    $cart = session()->get('cart', []);
    $cart[$productId] = [
        'product_id' => $productId,
        'quantity' => ($cart[$productId]['quantity'] ?? 0) + $quantity
    ];

    session()->put('cart', $cart);

    return redirect()->route('cart.index')->with('success', 'Product added  to cart');
}

public function index()
{
    $cart = session('cart', []);
    $productIds = array_keys($cart);
    $products = Product::whereIn('id', $productIds)->get();

    return Inertia::render('Cart', [
        'cartItems' => $products->map(function ($product) use ($cart) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $cart[$product->id]['quantity'],
            ];
        }),
    ]);
}

    public function update(Request $request)
    {
        $cart = session()->get('cart', []);
        if (isset($cart[$request->product_id])) {
            $cart[$request->product_id]['quantity'] = $request->quantity;
            session()->put('cart', $cart);
        }

       return redirect()->route('cart.index')->with('success', 'Product updated');
    }

    public function remove(Request $request)
    {
        $cart = session()->get('cart', []);
        unset($cart[$request->product_id]);
        session()->put('cart', $cart);

       return redirect()->route('cart.index')->with('success', 'Product removed from cart');
    }
}

