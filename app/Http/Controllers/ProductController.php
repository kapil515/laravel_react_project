<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
class ProductController extends Controller
{

public function index()
    {
        $products = Product::all()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'imageAlt' => $product->image_alt,
                'images' => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
            ];
        });

        return Inertia::render('ProductPage', [
            'products' => $products
        ]);
    }

    public function show($id)
{
    $product = Product::findOrFail($id);
    \Log::info('Showing product with ID:', ['id' => $id, 'product' => $product->toArray()]);

    return Inertia::render('SingleProduct', [
        'product' => [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'imageAlt' => $product->image_alt ?? 'Product image',
            'description' => $product->description ?? '',
            'images' => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
            'colors' => $product->colors ? json_decode($product->colors, true) : [],
            'sizes' => $product->sizes ? json_decode($product->sizes, true) : [],
            'highlights' => $product->highlights ? json_decode($product->highlights, true) : [],
            'details' => $product->details ?? '',
            'reviews' => [
                'average' => $product->reviews_average ?? 0,
                'totalCount' => $product->reviews_total_count ?? 0,
            ],
            'breadcrumbs' => [
                ['id' => 1, 'name' => 'Home', 'href' => '/'],
                ['id' => 2, 'name' => 'Products', 'href' => '/products'],
            ],
            'href' => '/products/' . $product->id,
        ],
    ]);
}

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|string',
        'image_alt' => 'required|string',
        'description' => 'nullable|string',
        'details' => 'nullable|string',
        'reviews_average' => 'nullable|numeric',
        'reviews_total_count' => 'nullable|integer',
        'images' => 'required|array',
        'images.*' => 'image|max:2048', 
    ]);

    $imagePaths = [];
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $path = $image->store('products', 'public'); 
            $imagePaths[] = $path;
        }
    }

    $product = Product::create([
        'name' => $validated['name'],
        'price' => $validated['price'],
        'image_alt' => $validated['image_alt'],
        'description' => $validated['description'],
        'details' => $validated['details'],
        'reviews_average' => $validated['reviews_average'],
        'reviews_total_count' => $validated['reviews_total_count'],
        'images' => json_encode($imagePaths), 
    ]);

    Log::info('Product created:', $product->toArray());

    return back()->with('success', 'Product created successfully');
}

 public function edit($id)
{
    $product = Product::findOrFail($id);

    return Inertia::render('Dashboard/EditProductForm', [
        'product' => [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'description' => $product->description,
            'image' => $product->image_path, 
        ]
    ]);
}

public function update(Request $request, Product $product)
{
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric',
        'description' => 'nullable|string',
        'image' => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $data['image_path'] = $request->file('image')->store('products', 'public');
    }

    $product->update($data);

    return redirect()->route('dashboard.products')->with('success', 'Product updated!');
}




   public function destroy($id)
{
    $product = Product::findOrFail($id);
    $product->delete();

    return redirect()->back()->with('success', 'Product deleted successfully!');
}


}
