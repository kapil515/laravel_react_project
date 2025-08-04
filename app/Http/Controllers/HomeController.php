<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $categoryId = $request->query('category_id', '');
        $subcategoryId = $request->query('subcategory_id', '');
        $productsQuery = Product::where('status', 'active');

        if ($subcategoryId) {
            $productsQuery->where('subcategory_id', $subcategoryId);
        } elseif ($categoryId) {
            $productsQuery->where('category_id', $categoryId);
        }

        $products = $productsQuery
            ->latest()
            ->paginate(5)
            ->appends(['category_id' => $categoryId, 'subcategory_id' => $subcategoryId])
            ->through(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_alt' => $product->image_alt,
                    'images' => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
                    'category_id' => $product->category_id,
                    'subcategory_id' => $product->subcategory_id ?? null,
                ];
            });

        return Inertia::render('Home', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => App::version(),
            'phpVersion' => PHP_VERSION,
            'products' => $products,
            'categories' => Category::with('subcategories')->get()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'image_src' => $category->image_src,
                    'image_alt' => $category->image_alt,
                    'description' => $category->description,
                    'subcategories' => $category->subcategories->map(function ($subcategory) {
                        return [
                            'id' => $subcategory->id,
                            'name' => $subcategory->name,
                        ];
                    }),
                ];
            }),
            'auth' => [
                'user' => Auth::user(),
            ],
            'filters' => [
                'category_id' => $categoryId,
                'subcategory_id' => $subcategoryId,
            ],
        ]);
    }
}