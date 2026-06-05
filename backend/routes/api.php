<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health Check
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'System is healthy',
        'data' => [
            'status' => 'ok',
            'timestamp' => now()->toIso8601ZuluString(),
        ],
        'meta' => ['version' => '1.0']
    ]);
});

Route::prefix('v1')->middleware([\App\Http\Middleware\VisitorTrackingMiddleware::class])->group(function () {
    
    // Ping
    Route::get('/ping', function () {
        return response()->json([
            'success' => true,
            'message' => 'Pong',
            'data' => ['pong' => true],
            'meta' => ['version' => '1.0']
        ]);
    });

    // Authentication Routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'register'])->middleware('throttle:auth');
        Route::post('/login', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'login'])->middleware('throttle:auth');
        Route::post('/forgot-password', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'forgotPassword'])->middleware('throttle:forgot-password');
        Route::post('/reset-password', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'resetPassword'])->middleware('throttle:auth');
        
        Route::post('/otp/send', [\App\Http\Controllers\Api\V1\Auth\OtpController::class, 'send'])->middleware('throttle:auth');
        Route::post('/otp/verify', [\App\Http\Controllers\Api\V1\Auth\OtpController::class, 'verify'])->middleware('throttle:auth');

        // Authenticated Auth Routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'logout']);
            Route::get('/me', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'me']);
        });
    });

    // Authenticated Routes
    Route::middleware('auth:sanctum')->group(function () {
        
        // Cart Routes
        Route::prefix('cart')->group(function () {
            Route::get('/', function () { /* TODO */ });
            Route::post('/items', function () { /* TODO */ });
            Route::put('/items/{id}', function () { /* TODO */ });
            Route::delete('/items/{id}', function () { /* TODO */ });
        });

        // Checkout & Orders
        Route::post('/checkout', function () { /* TODO */ });
        Route::get('/orders', function () { /* TODO */ });
        Route::get('/orders/{id}', function () { /* TODO */ });
        Route::post('/orders', function () { /* TODO */ });

        // Seller Specific Routes
        Route::prefix('seller')->group(function () {
            Route::get('/dashboard', function () { /* TODO */ });
            Route::get('/analytics', function () { /* TODO */ });
            
            Route::get('/orders', function () { /* TODO */ });
            Route::patch('/orders/{id}/approve', function () { /* TODO */ });
            Route::patch('/orders/{id}/reject', function () { /* TODO */ });
            Route::patch('/orders/{id}/status', function () { /* TODO */ });

            Route::get('/customers', function () { /* TODO */ });
            Route::get('/customers/{id}', function () { /* TODO */ });
        });

        // Admin Routes
        Route::prefix('admin')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\Api\V1\Admin\ConsumerController::class, 'dashboard']);
            Route::get('/consumers', [\App\Http\Controllers\Api\V1\Admin\ConsumerController::class, 'index']);
            Route::get('/consumers/{id}', [\App\Http\Controllers\Api\V1\Admin\ConsumerController::class, 'show']);
        });
    });

});
