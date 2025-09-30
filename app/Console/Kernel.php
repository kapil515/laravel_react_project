<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Jobs\GeneratePurchaseAlert;
use App\Models\Order;
use Carbon\Carbon;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        // Run every 5 minutes to check for recent orders
        $schedule->call(function () {
            $recentOrders = Order::where('created_at', '>=', Carbon::now()->subMinutes(5))->get();

            foreach ($recentOrders as $order) {
                GeneratePurchaseAlert::dispatch($order);
            }
        })->everyFiveMinutes();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
