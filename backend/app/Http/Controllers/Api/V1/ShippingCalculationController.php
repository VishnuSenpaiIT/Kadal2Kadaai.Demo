<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ShippingSetting;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingCalculationController extends Controller
{
    use ApiResponse;

    /**
     * Calculate simplified flat shipping charges.
     * Shipping is ₹50 flat, or FREE for orders ₹1000 and above.
     * No latitude/longitude or harbour configurations are required.
     */
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subtotal' => 'nullable|numeric|min:0',
        ]);

        $subtotal = isset($validated['subtotal']) ? (float) $validated['subtotal'] : 0.0;

        // Flat shipping rate logic
        $shippingCharge = ($subtotal >= 1000.0) ? 0.0 : 50.00;
        
        $taxAmount = round($subtotal * 0.05, 2);
        $totalAmount = $shippingCharge + $subtotal + $taxAmount;

        return $this->successResponse([
            'shipping_charge' => $shippingCharge,
            'tax_amount'      => $taxAmount,
            'subtotal'        => $subtotal,
            'total_amount'    => $totalAmount,
            'free_shipping_threshold' => 1000.0,
            'is_free_shipping' => ($shippingCharge === 0.0),
        ], 'Shipping calculated successfully');
    }

    /**
     * Get the Google Maps API Key for consumer address components.
     */
    public function getGoogleMapsKey(Request $request): JsonResponse
    {
        $settings = ShippingSetting::first();
        $key = $settings?->google_maps_api_key ?: env('GOOGLE_MAPS_API_KEY');
        
        return $this->successResponse([
            'google_maps_api_key' => $key
        ], 'Maps configuration retrieved');
    }

    /**
     * Proxy geocoding requests to Google Maps API to bypass referer restrictions on consumer side.
     */
    public function geocode(Request $request): JsonResponse
    {
        $settings = ShippingSetting::first();
        $key = $settings?->google_maps_api_key ?: env('GOOGLE_MAPS_API_KEY');

        if (!$key) {
            return response()->json([
                'status' => 'ERROR',
                'error_message' => 'Google Maps API key is not configured on the server.'
            ], 422);
        }

        $params = [
            'key' => $key
        ];

        if ($request->has('address')) {
            $params['address'] = $request->query('address');
        }

        if ($request->has('latlng')) {
            $params['latlng'] = $request->query('latlng');
        }

        $response = \Illuminate\Support\Facades\Http::get('https://maps.googleapis.com/maps/api/geocode/json', $params);

        return response()->json($response->json(), $response->status());
    }
}
