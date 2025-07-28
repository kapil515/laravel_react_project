<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class CartController extends Controller
{
     public function index(Request $request)
    {
        $cart = session()->get('cart', []);
        return Inertia::render('Cart', [
            'cart' => $cart,
        ]);
    }

    public function add(Request $request)
    {
        $product = Product::findOrFail($request->product_id);

        $cart = session()->get('cart', []);
        $quantity = $request->quantity ?? 1;

        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity'] += $quantity;
        } else {
            $cart[$product->id] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'image' => $product->images[0] ?? null,
                'quantity' => $quantity,
            ];
        }

        session()->put('cart', $cart);

        return redirect()->back()->with('message', 'Product added to cart.');
    }

    public function update(Request $request)
    {
        $cart = session()->get('cart', []);
        if (isset($cart[$request->product_id])) {
            $cart[$request->product_id]['quantity'] = $request->quantity;
            session()->put('cart', $cart);
        }

        return redirect()->back();
    }

    public function remove(Request $request)
    {
        $cart = session()->get('cart', []);
        unset($cart[$request->product_id]);
        session()->put('cart', $cart);

        return redirect()->back();
    }
}

