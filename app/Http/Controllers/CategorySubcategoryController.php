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

//     public function storeWithSubcategory(Request $request)
// {
//     $request->validate([
//         'category' => 'required|string|max:255',
//         'subcategory' => 'nullable|string|max:255',
//     ]);

//     // Create or find existing category
//     $category = Category::firstOrCreate([
//         'name' => $request->category,
//     ]);

//     // If subcategory is given, create and associate
//     if ($request->filled('subcategory')) {
//         Subcategory::create([
//             'name' => $request->subcategory,
//             'category_id' => $category->id,
//         ]);
//     }

//     return back()->with('success', 'Category and subcategory saved successfully.');
// }

// public function create()
// {
//     $categories = Category::with('subcategories')->get(); 

//     return Inertia::render('YourProductCreatePage', [
//         'categories' => $categories,
//     ]);
// }

// }
    private function authorizeAdmin()
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }

    // ========================= CATEGORY METHOD =========================

    public function index()
    {
        $this->authorizeAdmin();

        $categories = Category::with('subcategories')->get();

        return inertia('Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function storeCategory(Request $request)
    {
        $this->authorizeAdmin();

        $request->validate([
            'name' => 'required|string|unique:categories,name'
        ]);

        Category::create([
            'name' => $request->name
        ]);

        return redirect()->back()->with('success', 'Category created.');
    }

    public function updateCategory(Request $request, Category $category)
    {
        $this->authorizeAdmin();

        $request->validate([
            'name' => 'required|string|unique:categories,name,' . $category->id
        ]);

        $category->update([
            'name' => $request->name
        ]);

        return redirect()->back()->with('success', 'Category updated.');
    }

    public function deleteCategory(Category $category)
    {
        $this->authorizeAdmin();

        $category->delete();

        return redirect()->back()->with('success', 'Category deleted.');
    }

    // ===================== SUBCATEGORY METHODS =========================

    public function storeSubcategory(Request $request)
    {
        $this->authorizeAdmin();

        $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        Subcategory::create([
            'name' => $request->name,
            'category_id' => $request->category_id
        ]);

        return redirect()->back()->with('success', 'Subcategory created.');
    }

    public function updateSubcategory(Request $request, Subcategory $subcategory)
    {
        $this->authorizeAdmin();

        $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $subcategory->update([
            'name' => $request->name,
            'category_id' => $request->category_id
        ]);

        return redirect()->back()->with('success', 'Subcategory updated.');
    }

    public function deleteSubcategory(Subcategory $subcategory)
    {
        $this->authorizeAdmin();

        $subcategory->delete();

        return redirect()->back()->with('success', 'Subcategory deleted.');
    }
}
