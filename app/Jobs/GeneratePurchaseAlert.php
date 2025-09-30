<?php

namespace App\Jobs;

use App\Http\Controllers\PurchaseAlertController;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class GeneratePurchaseAlert implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function handle()
    {
        app(PurchaseAlertController::class)->getAlert();
    }
}