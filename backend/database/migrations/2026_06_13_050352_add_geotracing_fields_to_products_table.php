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
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('origin_harbor_id')->nullable();
            $table->integer('max_transit_hours')->nullable();

            $table->foreign('origin_harbor_id')->references('id')->on('harbours')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['origin_harbor_id']);
            $table->dropColumn(['origin_harbor_id', 'max_transit_hours']);
        });
    }
};
