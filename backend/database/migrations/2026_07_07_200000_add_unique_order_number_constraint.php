<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Fix 13: Adds a unique constraint on orders.order_number to prevent
 * duplicate order numbers under race conditions or high concurrency.
 *
 * Fix 2: Documents that APP_DEBUG must be false and APP_ENV must be
 * 'production' in all production .env files (enforced via .env.example).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Only add if not already present (e.g., existing SQLite dev DB already has it)
            if (!Schema::hasIndex('orders', 'orders_order_number_unique')) {
                $table->unique('order_number', 'orders_order_number_unique');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique('orders_order_number_unique');
        });
    }
};
