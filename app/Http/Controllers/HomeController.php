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
    $searchQuery = $request->query('search_query', '');
    $productsQuery = Product::where('status', 'active');

    if ($subcategoryId) {
        $productsQuery->where('subcategory_id', $subcategoryId);
    } elseif ($categoryId) {
        $productsQuery->where('category_id', $categoryId);
    }
    if ($searchQuery) {
        $productsQuery->where('name', 'like', '%' . $searchQuery . '%');
    }

    $products = $productsQuery
        ->latest()
        ->paginate(4)
        ->appends(['category_id' => $categoryId, 'subcategory_id' => $subcategoryId, 'search_query' => $searchQuery])
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

    // Update return to include search_query in filters
    return Inertia::render('Home', [
        // ... other props
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
        'filters' => [
            'category_id' => $categoryId,
            'subcategory_id' => $subcategoryId,
            'search_query' => $searchQuery,
        ],
    ]);
}
}