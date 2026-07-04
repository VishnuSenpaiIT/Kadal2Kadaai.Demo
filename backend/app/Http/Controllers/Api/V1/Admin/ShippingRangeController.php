<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingDistanceRange;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingRangeController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the shipping ranges.
     */
    public function index(): JsonResponse
    {
        $ranges = ShippingDistanceRange::orderBy('from_distance', 'asc')->get();
        return $this->success($ranges, 'Shipping ranges retrieved successfully');
    }

    /**
     * Store a newly created shipping range in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from_distance'  => 'required|numeric|min:0',
            'to_distance'    => 'required|numeric|gt:from_distance',
            'shipping_price' => 'required|numeric|min:0',
            'status'         => 'boolean',
        ]);

        $from = $validated['from_distance'];
        $to = $validated['to_distance'];

        // Check overlapping ranges
        $overlapExists = ShippingDistanceRange::where(function ($query) use ($from, $to) {
            $query->where('from_distance', '<', $to)
                  ->where('to_distance', '>', $from);
        })->exists();

        if ($overlapExists) {
            return $this->errorResponse('This distance range overlaps with an existing range.', 422);
        }

        $range = ShippingDistanceRange::create($validated);

        return $this->created($range, 'Shipping range created successfully');
    }

    /**
     * Display the specified shipping range.
     */
    public function show(string $id): JsonResponse
    {
        $range = ShippingDistanceRange::findOrFail($id);
        return $this->success($range, 'Shipping range retrieved successfully');
    }

    /**
     * Update the specified shipping range in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $range = ShippingDistanceRange::findOrFail($id);

        $validated = $request->validate([
            'from_distance'  => 'sometimes|required|numeric|min:0',
            'to_distance'    => 'sometimes|required|numeric|gt:from_distance',
            'shipping_price' => 'sometimes|required|numeric|min:0',
            'status'         => 'boolean',
        ]);

        $from = $validated['from_distance'] ?? $range->from_distance;
        $to = $validated['to_distance'] ?? $range->to_distance;

        // Check overlapping ranges, excluding the current range
        $overlapExists = ShippingDistanceRange::where('id', '!=', $id)
            ->where(function ($query) use ($from, $to) {
                $query->where('from_distance', '<', $to)
                      ->where('to_distance', '>', $from);
            })->exists();

        if ($overlapExists) {
            return $this->errorResponse('This distance range overlaps with an existing range.', 422);
        }

        $range->update($validated);

        return $this->success($range, 'Shipping range updated successfully');
    }

    /**
     * Remove the specified shipping range from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $range = ShippingDistanceRange::findOrFail($id);
        $range->delete();

        return $this->success(null, 'Shipping range deleted successfully');
    }
}
