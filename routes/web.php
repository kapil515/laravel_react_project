<?php

use App\Http\Controllers\AiChatController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategorySubcategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RazorpayController;
use App\Http\Controllers\PayPalController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
Route::get('/shop/categories', [CategoryController::class, 'shop'])->name('category.shop');
Route::get('/category/{id}', [CategoryController::class, 'show'])->name('category.show');

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
    Route::get('/dashboard/products', [ProductController::class, 'products'])->name('dashboard.products');
    Route::get('/dashboard/members', [DashboardController::class, 'members'])->name('dashboard.members');
    Route::get('/dashboard/settings', [DashboardController::class, 'settings'])->name('dashboard.settings');
    Route::resource('products', ProductController::class);
    Route::put('/products/{id}/toggle-status', [ProductController::class, 'toggleStatus']);

    Route::get('/dashboard/products', [DashboardController::class, 'products'])->name('dashboard.products');

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/logout', function () {
        Auth::logout();
        return redirect('home');
    })->name('logout');
});

Route::get('/product/{id}', [ProductController::class, 'show'])->name('products.show');
Route::post('/products', [ProductController::class, 'store'])->name('products.store');
Route::get('/best-sellers', function () {
    return Inertia::render('BestSellers');
});

// Show edit form
Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');

// Update product (PUT method via Inertia)
Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');

Route::get('/productpage', [ProductController::class, 'index']);

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard/Categories', [DashboardController::class, 'Category'])->name('dashboard.categories');

    Route::post('/categories-with-subcategory', [CategorySubcategoryController::class, 'storeWithSubcategory'])->name('categories.with.subcategory');
// Category Routes
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
    Route::post('/cart/remove/{id}', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
});

Route::get('/paypal/success/{order}', [PayPalController::class, 'success'])->name('paypal.success');
Route::get('/paypal/cancel/{order}', [PayPalController::class, 'cancelTransaction'])->name('paypal.cancel');


Route::middleware(['auth'])->group(function () {
    Route::match(['get', 'post'], '/checkout/selected', [CartController::class, 'checkoutSelected'])->name('checkout.selected');
    Route::put('/users/{user}/toggle-active', [RegisteredUserController::class, 'toggleActive'])->name('users.toggleActive');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/orders/thankyou/{order}', [OrderController::class, 'show'])->name('orders.thankyou');
    Route::any('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/payment/razorpay/{order}', [RazorpayController::class, 'retryPayment'])->name('payment.razorpay');
    Route::post('/payment/razorpay/callback', [RazorpayController::class, 'callback'])->name('payment.razorpay.callback');
    Route::get('/payment/razorpay/debug', [RazorpayController::class, 'debug'])->name('payment.razorpay.debug');
     Route::delete('/transactions/{id}', [OrderController::class, 'singledelete'])->name('transactions.singledelete');
      Route::post('/transactions/mass-delete', [OrderController::class, 'multipleDelete'])->name('transactions.multipleDelete');

    Route::middleware(['admin'])->group(function () {
        Route::get('/dashboard/orders', [OrderController::class, 'orders'])->name('dashboard.orders');
        Route::get('/dashboard/orders/{order}', [OrderController::class, 'adminShow'])->name('orders.adminshow');
        Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->name('orders.destroy');
        Route::post('/orders/mass-destroy', [OrderController::class, 'massDestroy'])->name('orders.massDestroy');

    });
});

Route::prefix('dashboard')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/settings', [DashboardController::class, 'settings'])->name('dashboard.settings');
    Route::post('/settings/profile', [DashboardController::class, 'updateProfile'])->name('dashboard.updateProfile');
    Route::post('/settings/password', [DashboardController::class, 'updatePassword'])->name('dashboard.updatePassword');
    Route::post('/settings/assign-role', [DashboardController::class, 'assignRole'])->name('dashboard.assignRole');
});

Route::get('/chat', function () {
    return Inertia::render('ChatApp');
});
Route::post('/api/chat', [AiChatController::class, 'chat']);


require __DIR__ . '/auth.php';
