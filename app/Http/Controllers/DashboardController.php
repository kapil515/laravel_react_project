<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', ['section' => 'home']);
    }

    public function users()
    {
        return Inertia::render('Dashboard', ['section' => 'users']);
    }

    public function transactions()
    {
        return Inertia::render('Dashboard', ['section' => 'transactions']);
    }

    public function sales()
    {
        return Inertia::render('Dashboard', ['section' => 'sales']);
    }

   public function products()
{
    $products = Product::paginate(5)->through(function ($product) {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'imageAlt' => $product->image_alt,
            'images' => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
        ];
    });

    return Inertia::render('Dashboard', [  
        'section' => 'products',
        'products' => $products
    ]);
}


    public function members()
    {
        return Inertia::render('Dashboard', ['section' => 'members']);
    }

    public function settings()
    {
        return Inertia::render('Dashboard', ['section' => 'settings']);
    }
}
