<?php
use App\Http\Controllers\Api\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::post('/checkout', [CheckoutController::class, 'process']);
Route::get('/stripe', [CheckoutController::class, 'showStripePage']);
Route::post('/orders/{order}/pay', [CheckoutController::class, 'process']);


