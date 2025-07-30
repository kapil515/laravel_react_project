<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => App::version(),
            'phpVersion' => PHP_VERSION,
            'products' => Product::latest()->paginate(5)->through(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'imageAlt' => $product->image_alt,
                    'images' => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
                ];
            }),
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }
}
