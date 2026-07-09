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
     * Calculate shipping charges.
     * If an address_id is provided and matches a registered Area, uses the Area's custom shipping price.
     * Otherwise, falls back to the flat-rate logic: ₹50 flat, or FREE for orders ₹1000 and above.
     */
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subtotal'   => 'nullable|numeric|min:0',
            'address_id' => 'nullable|uuid|exists:addresses,id',
        ]);

        $subtotal = isset($validated['subtotal']) ? (float) $validated['subtotal'] : 0.0;

        $shippingCharge = null;

        if (!empty($validated['address_id'])) {
            $address = \App\Models\Address::find($validated['address_id']);
            if ($address && !empty($address->area_locality)) {
                // Find matching area in our Area Master (case-insensitive)
                $matchedArea = \App\Models\Area::whereRaw('LOWER(name) = ?', [strtolower(trim($address->area_locality))])->first();
                if ($matchedArea) {
                    $shippingCharge = (float) $matchedArea->shipping_price;
                }
            }
        }

        // Fallback to original flat shipping rate logic if no match found or no address provided
        if ($shippingCharge === null) {
            $shippingCharge = ($subtotal >= 1000.0) ? 0.0 : 50.00;
        }

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

    /**
     * Proxy autocomplete requests to Google Places API.
     * Restricts results to India for Chennai-relevant suggestions.
     */
    public function placesAutocomplete(Request $request): JsonResponse
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
            'key'        => $key,
            'input'      => $request->query('input'),
            'components' => 'country:in', // Restrict to India for Chennai relevance
        ];

        $response = \Illuminate\Support\Facades\Http::get('https://maps.googleapis.com/maps/api/place/autocomplete/json', $params);

        return response()->json($response->json(), $response->status());
    }
}
