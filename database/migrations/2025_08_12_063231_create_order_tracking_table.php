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
        Schema::create('order_tracking', function (Blueprint $table) {
          $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('location_text')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->enum('status', ['pending','packed','shipped','out_for_delivery', 'delivered','completed','canceled'])->default('pending');
            $table->string('tracking_provider')->nullable();
            $table->string('tracking_id')->nullable();
            $table->string('deliveryman_name')->nullable();
            $table->string('deliveryman_phone')->nullable();
            $table->text('note')->nullable();
            $table->string('external_event_id')->nullable()->index();
            $table->timestamp('reported_at')->nullable();
            $table->timestamps();
            $table->index(['order_id', 'status']);
            $table->index(['tracking_id']);
            $table->index(['reported_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_tracking');
    }
};
