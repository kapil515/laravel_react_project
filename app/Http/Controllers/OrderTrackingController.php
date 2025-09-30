<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderTracking;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class OrderTrackingController extends Controller
{
    public function trackPage($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->with(['user','items.product'])->firstOrFail();

        $events = $order->trackingEvents()->get();

        return Inertia::render('OrderTracking', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'tracking_id' => $events->first()?->tracking_id ?? null,
                'username' => optional($order->user)->name,
                'city' => $order->city,
                'items' => $order->items->map(fn($it) => [
                    'id' => $it->id,
                    'product_id' => $it->product_id,
                    'name' => optional($it->product)->name ?? 'Product',
                    'thumbnail' => optional($it->product)->thumbnail ?? null,
                    'quantity' => $it->quantity,
                ]),
            ],
            'trackingEvents' => $events->map(function($e) {
                return [
                    'id' => $e->id,
                    'location_text' => $e->location_text,
                    'latitude' => $e->latitude,
                    'longitude' => $e->longitude,
                    'status' => $e->status,
                    'note' => $e->note,
                    'driver_name' => $e->driver_name,
                    'driver_phone' => $e->driver_phone,
                    'reported_at' => $e->reported_at?->toDateTimeString() ?? $e->created_at->toDateTimeString(),
                    'product_id' => $e->product_id,
                ];
            }),
        ]);
    }

    // JSON endpoint used by polling to get up-to-date tracking events
    public function eventsJson($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();
        $events = $order->trackingEvents()->get();

        return response()->json([
            'order_number' => $order->order_number,
            'events' => $events->map(fn($e) => [
                'id' => $e->id,
                'location_text' => $e->location_text,
                'latitude' => $e->latitude,
                'longitude' => $e->longitude,
                'status' => $e->status,
                'note' => $e->note,
                'driver_name' => $e->driver_name,
                'driver_phone' => $e->driver_phone,
                'reported_at' => $e->reported_at ? $e->reported_at->toDateTimeString() : $e->created_at->toDateTimeString(),
                'product_id' => $e->product_id,
            ]),
        ]);
    }

    // Admin/manual add tracking event
    public function store(Request $request, $orderId)
    {
        // authorize: ensure admin (or role check) — adjust to your auth system
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'location_text' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'status' => ['required', 'string', Rule::in(['packed','shipped','in_transit','out_for_delivery','delivered','cancelled'])],
            'tracking_provider' => 'nullable|string|max:100',
            'tracking_id' => 'nullable|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'username' => 'nullable|string|max:255',
            'driver_name' => 'nullable|string|max:255',
            'driver_phone' => 'nullable|string|max:50',
            'note' => 'nullable|string',
            'external_event_id' => 'nullable|string|max:255',
            'reported_at' => 'nullable|date',
        ]);

        $data['order_id'] = $orderId;
        $data['reported_at'] = $data['reported_at'] ?? now();

        $event = OrderTracking::create($data);

        return back()->with('success', 'Event added.');
    }

    // Courier webhook (api) — examples: Shiprocket or Delhivery will post here
    public function courierWebhook(Request $request)
    {
        // Validate basic shape — courier providers differ; adapt mapping below.
        // Example expected keys (adapt for real provider):
        // order_number, tracking_id, status, location, time, external_id, lat, lng
        $payload = $request->all();

        // Find the order (provider may send tracking_id)
        $order = null;
        if (!empty($payload['order_number'])) {
            $order = Order::where('order_number', $payload['order_number'])->first();
        }
        if (!$order && !empty($payload['tracking_id'])) {
            $order = Order::where('tracking_id', $payload['tracking_id'])->first();
        }

        if (!$order) {
            // Could respond 404 — but return 200 to avoid webhook retries if you prefer
            return response()->json(['message' => 'order not found'], 404);
        }

        // map fields
        $event = OrderTracking::updateOrCreate(
            [
                'order_id' => $order->id,
                'external_event_id' => $payload['external_event_id'] ?? $payload['update_id'] ?? null
            ],
            [
                'tracking_id' => $payload['tracking_id'] ?? null,
                'tracking_provider' => $payload['provider'] ?? null,
                'status' => $payload['status'] ?? 'in_transit',
                'location_text' => $payload['location'] ?? ($payload['facility'] ?? null),
                'note' => $payload['note'] ?? null,
                'latitude' => $payload['latitude'] ?? null,
                'longitude' => $payload['longitude'] ?? null,
                'reported_at' => $payload['time'] ?? now(),
            ]
        );

        return response()->json(['ok' => true]);
    }
}
