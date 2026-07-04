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
        // Create shipping_distance_ranges table
        Schema::create('shipping_distance_ranges', function (Blueprint $table) {
            $table->id();
            $table->decimal('from_distance', 10, 2);
            $table->decimal('to_distance', 10, 2);
            $table->decimal('shipping_price', 10, 2);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        // Create shipping_settings table
        Schema::create('shipping_settings', function (Blueprint $table) {
            $table->id();
            $table->text('google_maps_api_key')->nullable(); // will be encrypted
            $table->unsignedBigInteger('default_harbour_id')->nullable();
            $table->timestamps();

            $table->foreign('default_harbour_id')->references('id')->on('harbours')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_settings');
        Schema::dropIfExists('shipping_distance_ranges');
    }
};
