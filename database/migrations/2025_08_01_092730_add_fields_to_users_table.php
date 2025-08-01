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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->string('image')->nullable();
              if (!Schema::hasColumn('users', 'active')) {
            $table->boolean('active')->default(true);
        }
            $table->timestamp('registered_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'image', 'active', 'registered_at']);
        });
    }
};
