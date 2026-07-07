<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingSetting;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingSettingController extends Controller
{
    use ApiResponse;

    /**
     * Get the current shipping settings.
     */
    public function show(): JsonResponse
    {
        $settings = ShippingSetting::firstOrCreate([]);
        
        $key = $settings->google_maps_api_key ?: env('GOOGLE_MAPS_API_KEY');
        $maskedKey = null;

        if ($key) {
            if (strlen($key) > 8) {
                $maskedKey = substr($key, 0, 6) . str_repeat('*', strlen($key) - 8) . substr($key, -2);
            } else {
                $maskedKey = str_repeat('*', 8);
            }
        }

        return $this->success([
            'id'                  => $settings->id,
            'google_maps_api_key' => $maskedKey,
            'default_harbour_id'  => $settings->default_harbour_id,
        ], 'Shipping settings retrieved successfully');
    }

    /**
     * Update the shipping settings.
     */
    public function update(Request $request): JsonResponse
    {
        $settings = ShippingSetting::firstOrCreate([]);

        $validated = $request->validate([
            'google_maps_api_key' => 'nullable|string|max:500',
            'default_harbour_id'  => 'nullable|exists:harbours,id',
        ]);

        $updateData = [];

        if ($request->filled('default_harbour_id') || $request->isNotFilled('default_harbour_id')) {
            $updateData['default_harbour_id'] = $validated['default_harbour_id'] ?? null;
        }

        // Only update API key if it's set and has changed (doesn't contain asterisks)
        if ($request->has('google_maps_api_key')) {
            $newKey = $validated['google_maps_api_key'];
            if ($newKey !== null && strpos($newKey, '*') === false) {
                $updateData['google_maps_api_key'] = $newKey;
            }
        }

        $settings->update($updateData);

        // Return masked response
        $key = $settings->google_maps_api_key ?: env('GOOGLE_MAPS_API_KEY');
        $maskedKey = null;

        if ($key) {
            if (strlen($key) > 8) {
                $maskedKey = substr($key, 0, 6) . str_repeat('*', strlen($key) - 8) . substr($key, -2);
            } else {
                $maskedKey = str_repeat('*', 8);
            }
        }

        return $this->success([
            'id'                  => $settings->id,
            'google_maps_api_key' => $maskedKey,
            'default_harbour_id'  => $settings->default_harbour_id,
        ], 'Shipping settings updated successfully');
    }
}
