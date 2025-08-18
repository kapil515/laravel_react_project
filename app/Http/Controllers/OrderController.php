<?php
    namespace App\Http\Controllers;

    use App\Models\Order;
    use App\Models\OrderItem;
    use App\Models\Product;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Support\Facades\Log;
    use App\Events\OrderTrackingUpdated;
    use App\Notifications\OrderStatusUpdated;
    use App\Models\OrderTracking;
    use Illuminate\Support\Facades\Storage;
    use Inertia\Inertia;
    use Symfony\Component\HttpFoundation\StreamedResponse;
  


    class OrderController extends Controller
    {

        public function orders()
        {
            if (auth()->user()->role !== 'admin') {
                Log::warning('Unauthorized access attempt to orders dashboard', ['user_id' => auth()->id()]);
                abort(403, 'Unauthorized');
            }

       $orders = Order::with(['items.product', 'user', 'payment','trackingEvents'])
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
                        'id'             => $order->id,
                        'order_number'   => $order->order_number ?? 'ORD-' . $order->id,
                        'user'           => $order->user ? [
                            'name'  => $order->user->name,
                            'email' => $order->user->email,
                            'role'  => $order->user->role,
                            'phone' => $order->user->phone ?? 'N/A',
                        ] : null,
                        'items'          => $order->items,
                        'status'         => $order->status,
                        'shipping_fee'   => $order->shipping_fee,
                        'total_amount'   => $order->total_amount,
                        'payment_method' => $order->payment_method,
                        'payment'        => $order->payment,
                         'tracking_events' => $order->trackingEvents,
                    ];
                });

            Log::info('Orders retrieved for dashboard', ['total' => $orders->total(), 'user_id' => auth()->id()]);

            return Inertia::render('Dashboard', [
                'section'      => 'orders',
                'orders'       => $orders,
                'transactions' => $orders,
            ]);
        }

    public function myOrders()
    {
        if (auth()->user()->role === 'admin') {
            return redirect()->route('dashboard.orders');
        }

        $orders = Order::with(['items.product', 'user', 'payment', 'trackingEvents'])
            ->where('user_id', Auth::id())
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
                    'shipping_fee' => $order->shipping_fee,
                    'total_amount' => $order->total_amount,
                    'payment_method' => $order->payment_method,
                    'payment' => $order->payment,
                    'tracking_events' => $order->trackingEvents,
                ];
            });

        Log::info('My orders retrieved', ['total' => $orders->total(), 'user_id' => auth()->id()]);

        return Inertia::render('MyOrders', [
            'transactions' => $orders,
        ]);
    }

        public function store(Request $request)
        {

            $request->validate([
                'address_line1'   => 'required|max:255',
                'address_line2'   => 'nullable|max:255',
                'city'            => 'required|max:255',
                'state'           => 'required|max:255',
                'postal_code'     => 'required|max:20',
                'country'         => 'required|max:100',
                'payment_method'  => 'required|in:cod,credit_card,gpay,Razorpay,stripe,paypal,Stripe Payment',
                'cart'            => 'required|array|min:1',
                'cart.*.id'       => 'required|exists:products,id',
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
                'currency' =>   'USD',
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

            if ($request['payment_method'] === 'cod') {
                return redirect()->route('orders.thankyou', ['order' => $order->id]);
            }

            if ($request['payment_method'] === 'Razorpay') {
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

        }
        public function show(Order $order)
        {
            $order->load(['items.product', 'user', 'payment','trackingEvents']);
            $order->load(['items.product', 'user']);
            return Inertia::render('ThankYou', ['order' => $order->toArray() + [
                'shipping_fee'   => $order->shipping_fee,
                'transaction_id' => optional($order->payment)->transaction_id,
                'flash'          => session('flash', []),
                 'tracking_events' => $order->trackingEvents,
            ]]);
        }

        public function userShow(Order $order)
    {
         $user = Auth::user();

    if ($user->role !== 'admin' && $order->user_id !== $user->id) {
        Log::warning('Unauthorized access attempt to order details by user', [
            'order_id' => $order->id,
            'user_id' => $user->id
        ]);
        abort(403, 'Unauthorized');
    }

         $order->load(['items.product.category', 'items.product.subcategory', 'user','trackingEvents','payment']);

        foreach ($order->items as $item) {
            $images = is_string($item->product->images)
                ? json_decode($item->product->images, true)
                : ($item->product->images ?? []);
            $item->product->images = collect($images)->map(function ($image) {
                return Storage::url($image);
            });
        }

        return Inertia::render('Dashboard/OrderDetails', [
            'order' => [
                'id'             => $order->id,
                'order_number'   => $order->order_number ?? 'ORD-' . $order->id,
                'user'           => $order->user ? [
                    'name'  => $order->user->name,
                    'email' => $order->user->email,
                    'phone' => $order->user->phone ?? 'N/A',
                ] : null,
                'items'          => $order->items,
                'status'         => $order->status,
                'total_amount'   => $order->total_amount,
                'payment_method' => $order->payment_method,
                'shipping_fee'   => $order->shipping_fee,
                'address'        => [
                    'address_line1' => $order->address_line1,
                    'address_line2' => $order->address_line2 ?? 'N/A',
                    'city'          => $order->city,
                    'state'         => $order->state,
                    'postal_code'   => $order->postal_code,
                    'country'       => $order->country,
                ],
                'payment'        => $order->payment ? [
                    'transaction_id' => $order->payment->transaction_id,
                ] : null,
                'tracking_events' => $order->trackingEvents,
                'created_at'     => $order->created_at->toDateTimeString(),
            ],
        ]);
    }


        public function adminShow(Order $order)
        {
            if (auth()->user()->role !== 'admin') {
                Log::warning('Unauthorized access attempt to order details', ['order_id' => $order->id, 'user_id' => auth()->id()]);
                abort(403, 'Unauthorized');
            }

            $order->load(['items.product.category', 'items.product.subcategory', 'user','trackingEvents']);

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
                'order'   => [
                    'id'             => $order->id,
                    'order_number'   => $order->order_number ?? 'ORD-' . $order->id,
                    'user'           => $order->user ? [
                        'name'  => $order->user->name,
                        'email' => $order->user->email,
                        'role'  => $order->user->role,
                        'phone' => $order->user->phone ?? 'N/A',
                    ] : null,
                    'items'          => $order->items,
                    'status'         => $order->status,
                    'total_amount'   => $order->total_amount,
                    'payment_method' => $order->payment_method,
                    'shipping_fee'   => $order->shipping_fee,
                    'address'        => [
                        'address_line1' => $order->address_line1,
                        'address_line2' => $order->address_line2 ?? 'N/A',
                        'city'          => $order->city,
                        'state'         => $order->state,
                        'postal_code'   => $order->postal_code,
                        'country'       => $order->country,
                    ],
                     'tracking_events' => $order->trackingEvents,
                ],
            ]);
        }
 
public function updateTrackingStatus(Request $request, Order $order)
{
     if (auth()->user()->role !== 'admin' && $order->user_id !== Auth::id()) {
            Log::warning('Unauthorized attempt to update tracking status', ['order_id' => $order->id, 'user_id' => auth()->id()]);
            abort(403, 'Unauthorized');
        }

    $validStatuses = ['packed', 'shipped', 'out_for_delivery', 'delivered'];

     $request->validate([
            'status' => ['required', 'in:' . implode(',', $validStatuses)],
            'location_text' => ['nullable', 'string', 'max:255'],
            'deliveryman_name' => ['nullable', 'string', 'max:255'],
            'deliveryman_phone' => ['nullable', 'string', 'max:20'],
        ]);

    $newStatus = $request->status;

    $statusOrder = ['pending', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    $currentStatus = $order->status ?? 'pending';
    $currentIndex = array_search($currentStatus, $statusOrder);
    $newIndex = array_search($newStatus, $statusOrder);

    if ($newIndex <= $currentIndex) {
        return back()->withErrors(['status' => 'Cannot move to a previous or same status.']);
    }

    $trackingData = [
            'status' => $newStatus,
            'reported_at' => now(),
            'location_text' => $request->input('location_text'),
            'deliveryman_name' => $request->input('deliveryman_name'),
            'deliveryman_phone' => $request->input('deliveryman_phone'),
        ];

        $tracking = $order->latestTracking;
        if ($tracking) {
            $tracking->update($trackingData);
        } else {
            $tracking = $order->trackingEvents()->create($trackingData);
        }
    $order->update(['status' => $newStatus]);

    if ($order->user) {
            $order->user->notify(new OrderStatusUpdated($order, $newStatus, $tracking));
        }

     event(new OrderTrackingUpdated(
            $order,
            $newStatus,
            null,
            $request->input('deliveryman_name'),
            $request->input('deliveryman_phone'),
            $request->input('location_text')
        ));


    return redirect()->back()->with('success', 'Tracking status updated.')
        ->with([
            'transactions' => $order->fresh()->load('latestTracking', 'trackingEvents', 'user', 'payment')
        ]);
}

 public function cancelOrder(Request $request, Order $order)
    {
        if (auth()->user()->role !== 'admin' && $order->user_id !== Auth::id()) {
            Log::warning('Unauthorized attempt to cancel order', ['order_id' => $order->id, 'user_id' => auth()->id()]);
            abort(403, 'Unauthorized');
        }

        $statusOrder = ['pending', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
        $currentStatus = $order->status ?? 'pending';
        $currentIndex = array_search($currentStatus, $statusOrder);

       
        if ($currentIndex > array_search('shipped', $statusOrder)) {
            return back()->withErrors(['status' => 'Order cannot be canceled after it is shipped.']);
        }

        $order->update(['status' => 'canceled']);
        $tracking = $order->trackingEvents()->create([
            'status' => 'canceled',
            'reported_at' => now(),
            'note' => 'Order canceled by ' . (auth()->user()->role === 'admin' ? 'admin' : 'user') . '.',
        ]);
   // Send email notification
        if ($order->user) {
            $order->user->notify(new OrderStatusUpdated($order, 'canceled', $tracking));
        }

        // Broadcast event
        event(new OrderTrackingUpdated(
            $order,
            'canceled',
            'Order canceled by ' . (auth()->user()->role === 'admin' ? 'admin' : 'user') . '.'
        ));

        return redirect()->back()->with('success', 'Order has been canceled successfully.')
            ->with([
                'transactions' => $order->fresh()->load('latestTracking', 'trackingEvents', 'user', 'payment')
            ]);
    }


    public function track(Request $request, Order $order)
    {
        if (auth()->user()->role !== 'admin' && $order->user_id !== Auth::id()) {
            Log::warning('Unauthorized attempt to cancel order', ['order_id' => $order->id, 'user_id' => auth()->id()]);
            abort(403, 'Unauthorized');
        }

        $order->load(['trackingEvents', 'user']);

        return Inertia::render('OrderTrackingPage', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number ?? 'ORD-' . $order->id,
                'user' => $order->user ? [
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                    'phone' => $order->user->phone ?? 'N/A',
                ] : null,
                'status' => $order->status,
                'tracking_events' => $order->trackingEvents,
            ],
        ]);
    }

       public function destroy(string $id, Request $request)
{
    $order = Order::findOrFail($id);
        if (auth()->user()->role !== 'admin' && $order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

    Order::findOrFail($id)->delete();

    $perPage = 8;
    $totalOrders = Order::count();
    $lastPage = max(1, ceil($totalOrders / $perPage));

    $currentPage = (int) $request->get('page', 1);

    if ($currentPage > $lastPage) {
         return redirect()->route('orders.destroy', ['page' => $currentPage])
        ->with('success', 'Order deleted successfully.');
    }

   
}

public function massDestroy(Request $request)
{
    if (auth()->user()->role !== 'admin') {
        abort(403, 'Unauthorized');
    }

    $request->validate([
        'order_ids'   => 'required|array',
        'order_ids.*' => 'exists:orders,id',
    ]);

    Order::whereIn('id', $request->order_ids)->delete();

    $perPage = 8;
    $totalOrders = Order::count();
    $lastPage = max(1, ceil($totalOrders / $perPage));
    $currentPage = (int) $request->get('page', 1);

    if ($currentPage > $lastPage) {
         return redirect()->route('orders.massDestroy', ['page' => $currentPage])
        ->with('success', 'All selected orders deleted successfully.');
    }

   
}

public function singledelete(Request $request, $id)
{
   $order = Order::findOrFail($id);
        if (auth()->user()->role !== 'admin' && $order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

    Order::findOrFail($id)->delete();

    $perPage = 8;
    $totalOrders = Order::count();
    $lastPage = max(1, ceil($totalOrders / $perPage));
    $currentPage = $request->get('page', 1);

    if ($currentPage > $lastPage) {
        return redirect()->route('transactions.singledelete', ['page' => $lastPage])
            ->with('success', 'Transaction deleted successfully.');
    }

}

public function multipleDelete(Request $request)
{
   if (auth()->user()->role !== 'admin') {
        abort(403, 'Unauthorized');
    }

    $request->validate([
        'transaction_ids' => 'required|array',
        'transaction_ids.*' => 'exists:orders,id',
    ]);

    Order::whereIn('id', $request->transaction_ids)->delete();

    $perPage = 8;
    $totalOrders = Order::count();
    $lastPage = max(1, ceil($totalOrders / $perPage));
    $currentPage = $request->get('page', 1);

   if ($currentPage > $lastPage) {
        return redirect()->route('transactions', ['page' => $lastPage])
            ->with('success', 'Selected transactions deleted successfully.');
    }
}

  public function downloadCsv(Request $request)
    {
        $filename = 'orders_' . date('Ymd_His') . '.csv';

        $response = new StreamedResponse(function () use ($request) {
            $handle = fopen('php://output', 'w');

            // Optional: output BOM for Excel to detect UTF-8
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

        
            fputcsv($handle, [
                'Order Number',   
            'User',
            'Email',
            'Shipping Fee',
            'Total Amount',
            'Status',
            'Created At'
            ]);

             $ordersQuery = Order::with('user')->orderBy('id');
            if (auth()->user()->role !== 'admin') {
                $ordersQuery->where('user_id', Auth::id());
            }

             $ordersQuery->chunk(500, function ($orders) use ($handle) {
                foreach ($orders as $order) {
                    fputcsv($handle, [
                        $order->order_number,
                        optional($order->user)->name,
                        optional($order->user)->email,
                        number_format($order->shipping_fee ?? 0, 2, '.', ''),
                        number_format($order->total_amount ?? 0, 2, '.', ''),
                        $order->status,
                        $order->created_at->toDateTimeString(),
                    ]);
                }
            });

            fclose($handle);
        });

        $disposition = $response->headers->makeDisposition(
            'attachment',
            $filename
        );

        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', $disposition);

        return $response;
    }


    public function downloadSelectedCsv(Request $request)
{
    $ids = $request->query('ids'); // from ?ids=1,2,3
    $idsArray = $ids ? explode(',', $ids) : [];

    if (empty($idsArray)) {
        abort(400, 'No orders selected.');
    }

    $filename = 'selected_orders_' . date('Ymd_His') . '.csv';

    $response = new StreamedResponse(function () use ($idsArray) {
        $handle = fopen('php://output', 'w');

        // Optional BOM for Excel UTF-8
        fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

        // CSV Header
        fputcsv($handle, [
            'Order Number',
            'User',
            'Email',
            'Shipping Fee',
            'Total Amount',
            'Status',
            'Created At'
        ]);
        
            $ordersQuery = Order::with('user')
                ->whereIn('id', $idsArray)
                ->orderBy('id');
            if (auth()->user()->role !== 'admin') {
                $ordersQuery->where('user_id', Auth::id());
            }

      $ordersQuery->chunk(500, function ($orders) use ($handle) {
                foreach ($orders as $order) {
                    fputcsv($handle, [
                        $order->order_number,
                        optional($order->user)->name,
                        optional($order->user)->email,
                        number_format($order->shipping_fee ?? 0, 2, '.', ''),
                        number_format($order->total_amount ?? 0, 2, '.', ''),
                        $order->status,
                        $order->created_at->toDateTimeString(),
                    ]);
                }
            });

        fclose($handle);
    });

    $disposition = $response->headers->makeDisposition(
        'attachment',
        $filename
    );

    $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
    $response->headers->set('Content-Disposition', $disposition);

    return $response;
}


    }
