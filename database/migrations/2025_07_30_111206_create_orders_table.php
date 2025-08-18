<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique()->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('address_line1');            
            $table->string('address_line2')->nullable(); 
            $table->string('city');
            $table->string('state');
            $table->string('postal_code');
            $table->string('country');
            $table->string('payment_method');
            $table->decimal('total_amount', 10, 2);
             $table->decimal('shipping_fee', 8, 2)->nullable();
             $table->string('currency')->default('USD');
           $table->enum('status', ['pending', 'paid', 'packed', 'shipped','out_for_delivery', 'delivered', 'failed', 'completed','canceled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
