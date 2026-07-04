<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$images = \Illuminate\Support\Facades\DB::table('product_images')->take(10)->get();
foreach ($images as $img) {
    echo $img->product_id . " | " . $img->image_url . "\n";
}
