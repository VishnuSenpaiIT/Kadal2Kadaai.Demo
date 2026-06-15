<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::first();
if (!$user) {
    echo "No user found.\n";
    exit;
}

$request = \Illuminate\Http\Request::create('/api/addresses', 'POST', [
    'label' => 'test',
    'street' => 'street',
    'city' => 'city',
    'state' => 'state',
    'pincode' => '123456',
    'landmark' => 'mark',
    'is_default' => false
]);
$request->setUserResolver(function() use ($user) { return $user; });

try {
    $controller = app(\App\Http\Controllers\Api\V1\Consumer\AddressController::class);
    $response = $controller->store($request);
    echo $response->getContent();
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "Validation failed: " . json_encode($e->errors());
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
