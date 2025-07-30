<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Subcategory;

class CategorySubcategoryController extends Controller
{

    public function storeWithSubcategory(Request $request)
{
    $request->validate([
        'category' => 'required|string|max:255',
        'subcategory' => 'nullable|string|max:255',
    ]);

    // Create or find existing category
    $category = Category::firstOrCreate([
        'name' => $request->category,
    ]);

    // If subcategory is given, create and associate
    if ($request->filled('subcategory')) {
        Subcategory::create([
            'name' => $request->subcategory,
            'category_id' => $category->id,
        ]);
    }

    return back()->with('success', 'Category and subcategory saved successfully.');
}

public function create()
{
    $categories = Category::with('subcategories')->get(); 

    return Inertia::render('YourProductCreatePage', [
        'categories' => $categories,
    ]);
}

}
