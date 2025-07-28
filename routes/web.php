<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/logout', function () {Auth::logout();return redirect('home');})->name('logout');

});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
Route::post('/products', [ProductController::class, 'store'])->name('products.store');
Route::get('/best-sellers', function () {
    return Inertia::render('BestSellers');
});

Route::get('/productpage', [ProductController::class, 'index']);

require __DIR__ . '/auth.php';
