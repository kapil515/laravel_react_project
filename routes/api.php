<?php
use App\Http\Controllers\Api\CheckoutController;

Route::post('/checkout', [CheckoutController::class, 'process']);
Route::get('/stripe', [CheckoutController::class, 'showStripePage']);
Route::post('/orders/{order}/pay', [CheckoutController::class, 'process']);

