<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\CartItem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CartController extends Controller
{
     public function index()
    {
        $user = Auth::user();
        $cartItems = CartItem::with('product')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($item) {
                $images = is_string($item->product->images)
                    ? json_decode($item->product->images, true)
                    : $item->product->images;

                return [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'price' => $item->product->price,
                    'image_url' => !empty($images[0]) ? Storage::url($images[0]) : asset('default.png'),
                    'quantity' => $item->quantity,
                ];
            });

        return Inertia::render('Cart', [
            'cartItems' => $cartItems,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        $cartItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
        } else {
            CartItem::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return redirect()->route('cart.index')->with('message', 'Product added to cart!');
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        CartItem::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->update(['quantity' => $request->quantity]);

        return redirect()->route('cart.index');
    }

    public function remove($id)
    {
        CartItem::where('user_id', Auth::id())
            ->where('product_id', $id)
            ->delete();

        return redirect()->route('cart.index')->with('message', 'Item removed from cart.');
    }

    public function clear()
    {
        CartItem::where('user_id', Auth::id())->delete();

        return redirect()->route('cart.index')->with('message', 'Cart cleared.');
    }
}