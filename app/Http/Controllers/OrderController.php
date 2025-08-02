<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
   use App\Models\Payment;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
 use Illuminate\Support\Facades\Storage;


class OrderController extends Controller
{
 

public function orders()
{
    if (auth()->user()->role !== 'admin') {
        abort(403, 'Unauthorized');
    }

    $orders = Order::with(['items', 'user'])->latest()->paginate(8); 
    $orders->map(function ($order) {
        $order->items->map(function ($item) {
            $images = is_string($item->product->images)
                ? json_decode($item->product->images, true)
                : ($item->product->images ?? []);

            $item->product->images = collect($images)->map(function ($image) {
                return Storage::url($image);
            });
        });
        return $order;
    });

    return Inertia::render('Dashboard', [
        'section' => 'orders',
        'orders' => $orders,
    ]);
}

    public function store(Request $request)
    {
   
        $request->validate([
            'address_line1' => 'required|max:255',
            'address_line2' => 'required|max:255',
            'city' => 'required|max:255',
            'state' => 'required|max:255',
            'postal_code' => 'required|max:20',
            'country' => 'required|max:100',
           'payment_method' => 'required|in:cod,credit_card,gpay,online',
            'cart' => 'required|array|min:1',
        ]);

        $totalAmount = 0;

        foreach ($request['cart'] as $item) {
            $product = Product::findOrFail($item['id']);
            $totalAmount += $product->price * $item['quantity'];
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'address_line1' => $request['address_line1'],
            'address_line2' => $request['address_line2'],
            'city' => $request['city'],
            'state' => $request['state'],
            'postal_code' => $request['postal_code'],
            'country' => $request['country'],
            'payment_method' => $request['payment_method'],
            'status' => $request['payment_method'] === 'cod' ? 'processing' : 'pending',
            'total_amount' => $totalAmount,
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

        CartItem::where('user_id', Auth::id())
            ->whereIn('product_id', collect($request['cart'])->pluck('id'))
            ->delete();

        Log::info('Order created', ['order_id' => $order->id]);
         if ($request['payment_method'] === 'cod') {
            $shippingFee = 50;
            $order->total_amount += $shippingFee;
            $order->status = 'completed';
            $order->save();

            return redirect()->route('orders.thankyou', ['order' => $order->id]);
        }

        return redirect()->route('payment.credit', ['order' => $order->id]);
    }

     public function creditPayment(Order $order)
    {
        return Inertia::render('CreditCardPayment', ['order' => $order]);
    }



public function processCreditPayment(Request $request, Order $order)
{
     $method = $request->input('payment_method', 'credit_card');

    if ($method === 'credit_card') {
        $request->validate([
            'card_number' => 'required|digits_between:13,19',
            'expiry' => ['required', 'regex:/^(0[1-9]|1[0-2])\/([0-9]{2})$/'],
            'cvv' => 'required|digits_between:3,4',
            'cardholder_name' => 'required|string|max:255',
        ]);
    } elseif ($method === 'gpay') {
        $request->validate([
            'gpay_email' => 'required|email',
        ]);
    } elseif ($method === 'online') {
        $request->validate([
            'online_reference' => 'required|string|min:5',
        ]);
    }

    $order->update(['status' => 'completed']);

    return redirect()->route('orders.thankyou', $order->id)->with('success', 'Payment successful!');
}


    public function show(Order $order)
    {
        $order->load(['items.product', 'user']);
        return Inertia::render('ThankYou', ['order' => $order->toArray() + [
            'shippingFee' => $order->shippingFee, 
        ]]);
    }

   public function adminShow(Order $order)
{
    if (auth()->user()->role !== 'admin') {
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
            ...$order->toArray(),
            'address' => [
                'address_line1' => $order->address_line1,
                'address_line2' => $order->address_line2,
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
        abort(403, 'Unauthorized');
    }

    $order = Order::findOrFail($id);
    $order->delete();

    return back()->with('success', 'Order deleted successfully.');
}

public function massDestroy(Request $request)
{
    if (auth()->user()->role !== 'admin') {
        abort(403, 'Unauthorized');
    }

    $request->validate([
        'order_ids' => 'required|array',
        'order_ids.*' => 'exists:orders,id',
    ]);

    Order::whereIn('id', $request->order_ids)->delete();

    return back()->with('success', 'All selected orders deleted successfully.');
}


}
