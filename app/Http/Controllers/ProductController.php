<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
class ProductController extends Controller
{
   public function index(Request $request)
{
    $user = Auth::user();

    $products = Product::with(['category', 'subcategory', 'user'])
        ->when($user->role !== 'admin', fn($q) => $q->where('user_id', $user->id))
        ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
        ->when($request->subcategory_id, fn($q) => $q->where('subcategory_id', $request->subcategory_id))
        ->latest()
         ->paginate(8)
          ->through(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'imageAlt' => $product->image_alt,
                'images' => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
                'category' => $product->category?->name,
                'subcategory' => $product->subcategory?->name,
                'user' => [
                    'id' => $product->user?->id,
                    'name' => $product->user?->name,
                ],
            ];
        });

    $categories = Category::select('id', 'name')->get();
    $subcategories = Subcategory::select('id', 'name', 'category_id')->get();

    return Inertia::render('Products/Index', [
        'products' => $products,
        'categories' => $categories,
        'subcategories' => $subcategories,
        'user_id' => $user->id,
    ]);
}
    public function show($id)
    {
        $product = Product::with(['category', 'subcategory'])->findOrFail($id);

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
                'category' => $product->category?->name,
                'subcategory' => $product->subcategory?->name,
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
  // Show add product form
    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::with('subcategories')->get(),
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
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'images' => 'required|array',
            'images.*' => 'image|max:2048',
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('products', 'public');
            }
        }
        $product = Product::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'image_alt' => $validated['image_alt'],
            'description' => $validated['description'] ?? null,
            'details' => $validated['details'] ?? null,
            'reviews_average' => $validated['reviews_average'] ?? null,
            'reviews_total_count' => $validated['reviews_total_count'] ?? null,
            'category_id' => $validated['category_id'],
            'subcategory_id' => $validated['subcategory_id'],
            'images' => json_encode($imagePaths),
            'user_id' => Auth::id(), 
        ]);

        Log::info('Product created:', $product->toArray());

       return redirect()->route('products.index')->with('success', 'Product created successfully');
    }

    public function edit($id)
    {
        $product = Product::findOrFail($id);

        // Restrict access for normal users
        if (Auth::user()->role !== 'admin' && $product->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'description' => $product->description,
                'image' => $product->images ? json_decode($product->images)[0] ?? '' : '',
                'category_id' => $product->category_id,
                'subcategory_id' => $product->subcategory_id,
            ],
            'categories' => Category::with('subcategories')->get(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        if (Auth::user()->role !== 'admin' && $product->user_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['images'] = json_encode([
                $request->file('image')->store('products', 'public'),
            ]);
        }

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product updated!');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if (Auth::user()->role !== 'admin' && $product->user_id !== Auth::id()) {
            abort(403);
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully!');
    }
}


// public function index()
//     {
//         $products = Product::all()->map(function ($product) {
//             return [
//                 'id' => $product->id,
//                 'name' => $product->name,
//                 'price' => $product->price,
//                 'imageAlt' => $product->image_alt,
//                 'images' => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
//             ];
//         });

//         return Inertia::render('ProductPage', [
//             'products' => $products
//         ]);
//     }

//     public function show($id)
// {
//     $product = Product::findOrFail($id);
//     \Log::info('Showing product with ID:', ['id' => $id, 'product' => $product->toArray()]);

//     return Inertia::render('SingleProduct', [
//         'product' => [
//             'id' => $product->id,
//             'name' => $product->name,
//             'price' => $product->price,
//             'imageAlt' => $product->image_alt ?? 'Product image',
//             'description' => $product->description ?? '',
//             'images' => $product->images ? json_decode(str_replace('\/', '/', $product->images), true) : [],
//             'colors' => $product->colors ? json_decode($product->colors, true) : [],
//             'sizes' => $product->sizes ? json_decode($product->sizes, true) : [],
//             'highlights' => $product->highlights ? json_decode($product->highlights, true) : [],
//             'details' => $product->details ?? '',
//             'reviews' => [
//                 'average' => $product->reviews_average ?? 0,
//                 'totalCount' => $product->reviews_total_count ?? 0,
//             ],
//             'breadcrumbs' => [
//                 ['id' => 1, 'name' => 'Home', 'href' => '/'],
//                 ['id' => 2, 'name' => 'Products', 'href' => '/products'],
//             ],
//             'href' => '/products/' . $product->id,
//         ],
//     ]);
// }

//     public function store(Request $request)
// {
//     $validated = $request->validate([
//         'name' => 'required|string|max:255',
//         'price' => 'required|string',
//         'image_alt' => 'required|string',
//         'description' => 'nullable|string',
//         'details' => 'nullable|string',
//         'reviews_average' => 'nullable|numeric',
//         'reviews_total_count' => 'nullable|integer',
//         'images' => 'required|array',
//         'images.*' => 'image|max:2048', 
//     ]);

//     $imagePaths = [];
//     if ($request->hasFile('images')) {
//         foreach ($request->file('images') as $image) {
//             $path = $image->store('products', 'public'); 
//             $imagePaths[] = $path;
//         }
//     }

//     $product = Product::create([
//         'name' => $validated['name'],
//         'price' => $validated['price'],
//         'image_alt' => $validated['image_alt'],
//         'description' => $validated['description'],
//         'details' => $validated['details'],
//         'reviews_average' => $validated['reviews_average'],
//         'reviews_total_count' => $validated['reviews_total_count'],
//         'images' => json_encode($imagePaths), 
//     ]);

//     Log::info('Product created:', $product->toArray());

//     return back()->with('success', 'Product created successfully');
// }

//  public function edit($id)
// {
//     $product = Product::findOrFail($id);

//     return Inertia::render('Dashboard/EditProductForm', [
//         'product' => [
//             'id' => $product->id,
//             'name' => $product->name,
//             'price' => $product->price,
//             'description' => $product->description,
//             'image' => $product->image_path, 
//         ]
//     ]);
// }

// public function update(Request $request, Product $product)
// {
//     $data = $request->validate([
//         'name' => 'required|string|max:255',
//         'price' => 'required|numeric',
//         'description' => 'nullable|string',
//         'image' => 'nullable|image|max:2048',
//     ]);

//     if ($request->hasFile('image')) {
//         $data['image_path'] = $request->file('image')->store('products', 'public');
//     }

//     $product->update($data);

//     return redirect()->route('dashboard.products')->with('success', 'Product updated!');
// }




//    public function destroy($id)
// {
//     $product = Product::findOrFail($id);
//     $product->delete();

//     return redirect()->back()->with('success', 'Product deleted successfully!');
// }


// }
