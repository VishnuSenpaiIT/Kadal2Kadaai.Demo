<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            
            // Customer Details
            $table->string('full_name');
            $table->string('mobile_number');

            // Complete Address
            $table->string('house_flat_number');
            $table->string('street_name');
            $table->string('area_locality');
            $table->string('landmark')->nullable();
            $table->string('city', 100);
            $table->string('district', 100);
            $table->string('state', 100);
            $table->string('pincode', 20);

            // Coordinates
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);

            // Settings
            $table->string('address_type', 50)->default('Home'); // Home / Work / Other
            $table->text('delivery_instructions')->nullable();
            $table->boolean('is_default')->default(false);

            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('pincode');
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
