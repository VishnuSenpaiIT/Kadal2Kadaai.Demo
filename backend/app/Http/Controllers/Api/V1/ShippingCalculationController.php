<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Harbour;
use App\Models\ShippingDistanceRange;
use App\Models\ShippingSetting;
use App\Services\GeoRoutingService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingCalculationController extends Controller
{
    use ApiResponse;

    protected GeoRoutingService $geoRoutingService;

    public function __construct(GeoRoutingService $geoRoutingService)
    {
        $this->geoRoutingService = $geoRoutingService;
    }

    /**
     * Calculate shipping charge based on customer location and selected harbour.
     */
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'harbour_id' => 'nullable|exists:harbours,id',
            'latitude'   => 'required|numeric|between:-90,90',
            'longitude'  => 'required|numeric|between:-180,180',
            'subtotal'   => 'nullable|numeric|min:0',
        ]);

        $latitude = (float) $validated['latitude'];
        $longitude = (float) $validated['longitude'];
        $subtotal = isset($validated['subtotal']) ? (float) $validated['subtotal'] : 0.0;

        // 1. Resolve harbour
        $harbour = null;
        if (!empty($validated['harbour_id'])) {
            $harbour = Harbour::where('status', true)->find($validated['harbour_id']);
            if (!$harbour) {
                return $this->errorResponse('Selected harbour is inactive or not found.', 422);
            }
        } else {
            // Find default harbour
            $settings = ShippingSetting::first();
            if ($settings && $settings->default_harbour_id) {
                $harbour = Harbour::where('status', true)->find($settings->default_harbour_id);
            }
            
            // Fallback to first active harbour if default is not configured
            if (!$harbour) {
                $harbour = Harbour::where('status', true)->first();
            }
        }

        if (!$harbour) {
            return $this->errorResponse('No active harbours are available for shipping at this time.', 422);
        }

        // 2. Calculate distance using GeoRoutingService
        $distance = $this->geoRoutingService->calculateDistance($harbour, $latitude, $longitude);

        if ($distance === null) {
            return $this->errorResponse('Could not calculate shipping distance. Please check your delivery location coordinates.', 422);
        }

        // 3. Match distance with shipping range
        $range = ShippingDistanceRange::where('status', true)
            ->where('from_distance', '<=', $distance)
            ->where('to_distance', '>=', $distance)
            ->first();

        if (!$range) {
            return $this->errorResponse(sprintf('We do not deliver to this location (Distance: %.2f km is outside our delivery ranges).', $distance), 422);
        }

        $shippingCharge = (float) $range->shipping_price;
        $totalAmount = $shippingCharge + $subtotal;

        return $this->successResponse([
            'distance'        => round($distance, 2),
            'shipping_charge' => $shippingCharge,
            'total_amount'    => $totalAmount,
            'matched_range'   => [
                'id'             => $range->id,
                'from_distance'  => $range->from_distance,
                'to_distance'    => $range->to_distance,
                'shipping_price' => $range->shipping_price,
            ],
            'harbour'         => [
                'id'           => $harbour->id,
                'harbour_name' => $harbour->harbour_name,
                'address'      => $harbour->address,
            ]
        ], 'Shipping calculated successfully');
    }
}
