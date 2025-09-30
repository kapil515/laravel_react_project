<?php

namespace App\Http\Controllers;

use App\Events\PurchaseAlert;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class PurchaseAlertController extends Controller
{
    public function getAlert()
    {
        // Cache product names and images for 10 minutes
        $products = Cache::remember('products_for_alerts', 600, function () {
            return Product::select('id', 'name', 'images')->inRandomOrder()->take(50)->get();
        });

        // Sample names and locations
        $names = ['John', 'Emma', 'Michael', 'Sophie', 'Alex', 'Julia', 'David', 'Sarah'];
        $locations = ['New York', 'London', 'Sydney', 'Toronto', 'Mumbai', 'Berlin', 'Tokyo', 'Paris'];

        // Generate fake alert
        $product = $products->random();
        $alert = [
            'id' => Str::uuid()->toString(),
            'message' => sprintf(
                '%s from %s just bought %s!',
                $names[array_rand($names)],
                $locations[array_rand($locations)],
                $product->name
            ),
            'product_id' => $product->id,
            'product_image' => $product->images && is_array($product->images) ? $product->images[0] : null,
            'created_at' => now()->toDateTimeString(),
        ];

        // Broadcast the alert
        PurchaseAlert::dispatch($alert);

        return response()->json($alert);
    }
}