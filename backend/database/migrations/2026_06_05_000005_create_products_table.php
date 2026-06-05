<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('category_id')->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->string('unit', 50)->default('kg');
            $table->decimal('minimum_order', 8, 2)->default(0.25);
            $table->string('status', 20)->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->string('origin')->nullable();
            $table->text('freshness_notes')->nullable();
            $table->json('weight_options')->nullable();
            $table->unsignedInteger('view_count')->default(0);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('seller_id');
            $table->index('category_id');
            $table->index('status');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
