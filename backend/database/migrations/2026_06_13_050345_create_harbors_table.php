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
        Schema::create('harbours', function (Blueprint $table) {
            $table->id();
            $table->string('harbour_name');
            $table->string('harbour_code', 50)->nullable();
            $table->text('description')->nullable();
            
            // Address Fields
            $table->string('address_line_1');
            $table->string('address_line_2')->nullable();
            $table->string('area_locality');
            $table->string('landmark')->nullable();
            $table->string('city');
            $table->string('district');
            $table->string('state');
            $table->string('country')->default('India');
            $table->string('pincode', 20);

            // Coordinates & Google Data
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('google_place_id', 255)->nullable();
            $table->string('google_plus_code', 100)->nullable();
            $table->string('timezone', 100)->nullable();

            $table->boolean('status')->default(true);
            $table->timestamps();

            // Unique constraint on coordinates
            $table->unique(['latitude', 'longitude'], 'harbours_coords_unique');
            // Unique constraint on name + district
            $table->unique(['harbour_name', 'district'], 'harbours_name_district_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('harbours');
    }
};
