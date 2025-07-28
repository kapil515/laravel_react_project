<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');


Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/users', [DashboardController::class, 'users'])->name('dashboard.users');
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

Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
Route::post('/products', [ProductController::class, 'store'])->name('products.store');
Route::get('/best-sellers', function () {
    return Inertia::render('BestSellers'); 
});


// Show edit form
Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');

// Update product (PUT method via Inertia)
Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');


Route::get('/productpage', [ProductController::class, 'index']);

require __DIR__.'/auth.php';
