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
        Schema::create('pincode_distances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('harbor_id')->constrained('harbours')->cascadeOnDelete();
            $table->string('destination_pincode')->index();
            $table->decimal('distance_km', 10, 2)->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->string('status')->default('OK');
            $table->timestamps();

            $table->unique(['harbor_id', 'destination_pincode']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pincode_distances');
    }
};
