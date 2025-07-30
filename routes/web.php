<?php

use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategorySubcategoryController;
use Inertia\Inertia;
use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Auth;

Route::get('/', [HomeController::class, 'index'])->name('home');


Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/users', [DashboardController::class, 'users'])->name('dashboard.users');
    Route::get('/dashboard/users/{id}/edit', [DashboardController::class, 'edit'])->name('dashboard.users.edit');
    Route::put('/dashboard/users/{id}', [DashboardController::class, 'update'])->name('dashboard.users.update');
    Route::delete('/dashboard/users/{id}', [DashboardController::class, 'destroy'])->name('dashboard.users.destroy');
    Route::get('/dashboard/users/create', [DashboardController::class, 'create'])->name('dashboard.users.create');
    Route::post('/dashboard/users', [DashboardController::class, 'store'])->name('dashboard.users.store');
    Route::get('/dashboard/transactions', [DashboardController::class, 'transactions'])->name('dashboard.transactions');
    Route::get('/dashboard/sales', [DashboardController::class, 'sales'])->name('dashboard.sales');
    Route::get('/dashboard/products', [DashboardController::class, 'products'])->name('dashboard.products');
    Route::get('/dashboard/members', [DashboardController::class, 'members'])->name('dashboard.members');
    Route::get('/dashboard/settings', [DashboardController::class, 'settings'])->name('dashboard.settings');
    Route::resource('products', ProductController::class);

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/logout', function () {Auth::logout();return redirect('home');})->name('logout');

});

// Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
// Route::post('/products', [ProductController::class, 'store'])->name('products.store');
Route::get('/best-sellers', function () {
    return Inertia::render('BestSellers');
});


// // Show edit form
// Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');

// // Update product (PUT method via Inertia)
// Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');


// Route::get('/productpage', [ProductController::class, 'index']);


Route::middleware(['auth'])->group(function () {
    Route::get('/admin/categories', [CategorySubcategoryController::class, 'index'])->name('admin.categories.index');

    // Category Routes
    Route::post('/admin/categories', [CategorySubcategoryController::class, 'storeCategory'])->name('admin.categories.store');
    Route::put('/admin/categories/{category}', [CategorySubcategoryController::class, 'updateCategory'])->name('admin.categories.update');
    Route::delete('/admin/categories/{category}', [CategorySubcategoryController::class, 'deleteCategory'])->name('admin.categories.delete');

    // Subcategory Routes
    Route::post('/admin/subcategories', [CategorySubcategoryController::class, 'storeSubcategory'])->name('admin.subcategories.store');
    Route::put('/admin/subcategories/{subcategory}', [CategorySubcategoryController::class, 'updateSubcategory'])->name('admin.subcategories.update');
    Route::delete('/admin/subcategories/{subcategory}', [CategorySubcategoryController::class, 'deleteSubcategory'])->name('admin.subcategories.delete');
});



Route::middleware('auth')->group(function () {
  Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
   Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');
});


Route::middleware(['auth', 'admin'])->group(function () {
     Route::get('/dashboard/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
});
require __DIR__.'/auth.php';

