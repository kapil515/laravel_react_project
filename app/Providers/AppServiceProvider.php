<?php
namespace App\Providers;

use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
     public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Inertia::share([
            'cartCount' => function () {
                return Auth::check()
                    ? CartItem::where('user_id', Auth::id())->count()
                    : 0;
            },
            'stripe_public_key' => config('services.stripe.key'),
        ]);
    }

}
