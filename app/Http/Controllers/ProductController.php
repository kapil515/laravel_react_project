<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
class ProductController extends Controller
{

public function index()
{
    $products = Product::with(['category', 'subcategory'])
        ->where('status', 'active')
        ->latest()
        ->paginate(4)
        ->through(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'status' => $product->status,
                'imageAlt' => $product->image_alt,
                'images' => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
                'category' => $product->category ? $product->category->name : null,
                'subcategory' => $product->subcategory ? $product->subcategory->name : null,
            ];
        });

    return Inertia::render('ProductPage', [
        'products' => $products
    ]);
}


    public function show($id)
{
    $product = Product::findOrFail($id);

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
        'category_id' => 'nullable|exists:categories,id',
        'subcategory_id' => 'nullable|exists:subcategories,id',
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
        'category_id' => $validated['category_id'] ?? null,
        'subcategory_id' => $validated['subcategory_id'] ?? null,
    ]);

    Log::info('Product created:', $product->toArray());

    return back()->with('success', 'Product created successfully');
}

public function update(Request $request, Product $product)
{
    $validated = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'price' => 'sometimes|required|numeric',
        'description' => 'sometimes|required|string',
        'category_id' => 'nullable|exists:categories,id',
        'subcategory_id' => 'nullable|exists:subcategories,id',
        'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        'imageAlt' => 'nullable|string|max:255',
    ]);

    $product->update([
        'name' => $request->input('name', $product->name),
        'price' => $request->input('price', $product->price),
        'description' => $request->input('description', $product->description),
        'category_id' => $request->input('category_id', $product->category_id),
        'subcategory_id' => $request->input('subcategory_id', $product->subcategory_id),
        'image_alt' => $request->input('imageAlt', $product->image_alt),
    ]);

    $finalImages = [];

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $path = $image->store('products', 'public');
            $finalImages[] = $path;
        }
    } elseif ($request->has('existingImages')) {
        $existingImages = $request->input('existingImages');

        $finalImages = is_array($existingImages)
            ? $existingImages
            : json_decode($existingImages, true);
    }

    if (!empty($finalImages)) {
        $product->images = json_encode($finalImages);
        $product->save();
    }

    return redirect()->back()->with('success', 'Product updated successfully');
}


   public function destroy($id)
{
    $product = Product::findOrFail($id);
    $product->delete();

    return redirect()->back()->with('success', 'Product deleted successfully!');
}

public function toggleStatus(Request $request, $id)
{
    $product = Product::findOrFail($id);
    $product->status = $request->status;
    $product->save();

    return back()->with('message', 'Status updated');
}


  public function products()
    {
        $products = Product::latest()->paginate(4)->through(function ($product) {
            return [
                'id'             => $product->id,
                'name'           => $product->name,
                'price'          => $product->price,
                'status'         => $product->status,
                'category_id'    => $product->category_id,
                'subcategory_id' => $product->subcategory_id,
                'description'    => $product->description,
                'imageAlt'       => $product->image_alt,
                'images'         => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
            ];
        });

        $categories    = Category::with('subcategories')->get();
        $totalProducts = Product::count();

        return Inertia::render('Dashboard', [
            'section'       => 'products',
            'products'      => $products,
            'categories'    => $categories,
            'totalProducts' => $totalProducts,
        ]);
    }





}
