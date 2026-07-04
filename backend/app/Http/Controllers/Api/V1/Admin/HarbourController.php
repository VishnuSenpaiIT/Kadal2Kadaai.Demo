<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Harbour;
use App\Models\ShippingSetting;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class HarbourController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the harbours.
     */
    public function index(): JsonResponse
    {
        $harbours = Harbour::all();
        $settings = ShippingSetting::first();
        $defaultHarbourId = $settings?->default_harbour_id;

        $formattedHarbours = $harbours->map(function ($harbour) use ($defaultHarbourId) {
            $data = $harbour->toArray();
            $data['is_default'] = ($harbour->id === $defaultHarbourId);
            return $data;
        });

        return $this->success($formattedHarbours, 'Harbours retrieved successfully');
    }

    /**
     * Store a newly created harbour in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'harbour_name'     => 'required|string|max:255',
            'harbour_code'     => 'nullable|string|max:50',
            'description'      => 'nullable|string|max:5000',
            'address_line_1'   => 'required|string|max:255',
            'address_line_2'   => 'nullable|string|max:255',
            'area_locality'    => 'required|string|max:255',
            'landmark'         => 'nullable|string|max:255',
            'city'             => 'required|string|max:100',
            'district'         => 'required|string|max:100',
            'state'            => 'required|string|max:100',
            'country'          => 'required|string|max:100',
            'pincode'          => 'required|string|max:20',
            'latitude'         => 'required|numeric|between:-90,90',
            'longitude'        => 'required|numeric|between:-180,180',
            'google_place_id'  => 'nullable|string|max:255',
            'google_plus_code' => 'nullable|string|max:100',
            'timezone'         => 'nullable|string|max:100',
            'status'           => 'boolean',
            'is_default'       => 'boolean',
        ]);

        // 1. Prevent duplicate harbour locations (same coordinates: latitude and longitude)
        $lat = (float) $validated['latitude'];
        $lng = (float) $validated['longitude'];
        $coordsExist = Harbour::whereRaw('abs(latitude - ?) < 0.000001', [$lat])
            ->whereRaw('abs(longitude - ?) < 0.000001', [$lng])
            ->exists();
        
        if ($coordsExist) {
            throw ValidationException::withMessages([
                'latitude' => ['A harbour with these precise coordinates already exists.'],
            ]);
        }

        // 2. Prevent duplicate harbour names within the same district
        $nameExist = Harbour::where('harbour_name', $validated['harbour_name'])
            ->where('district', $validated['district'])
            ->exists();

        if ($nameExist) {
            throw ValidationException::withMessages([
                'harbour_name' => ['A harbour with this name already exists within the same district.'],
            ]);
        }

        $harbour = Harbour::create(\Arr::except($validated, ['is_default']));

        if ($request->boolean('is_default')) {
            $settings = ShippingSetting::firstOrCreate([]);
            $settings->update(['default_harbour_id' => $harbour->id]);
        }

        $response = $harbour->toArray();
        $response['is_default'] = $request->boolean('is_default');

        return $this->created($response, 'Harbour created successfully');
    }

    /**
     * Display the specified harbour.
     */
    public function show(string $id): JsonResponse
    {
        $harbour = Harbour::findOrFail($id);
        $settings = ShippingSetting::first();
        $isDefault = ($settings?->default_harbour_id === $harbour->id);

        $response = $harbour->toArray();
        $response['is_default'] = $isDefault;

        return $this->success($response, 'Harbour retrieved successfully');
    }

    /**
     * Update the specified harbour in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $harbour = Harbour::findOrFail($id);

        $validated = $request->validate([
            'harbour_name'     => 'sometimes|required|string|max:255',
            'harbour_code'     => 'nullable|string|max:50',
            'description'      => 'nullable|string|max:5000',
            'address_line_1'   => 'sometimes|required|string|max:255',
            'address_line_2'   => 'nullable|string|max:255',
            'area_locality'    => 'sometimes|required|string|max:255',
            'landmark'         => 'nullable|string|max:255',
            'city'             => 'sometimes|required|string|max:100',
            'district'         => 'sometimes|required|string|max:100',
            'state'            => 'sometimes|required|string|max:100',
            'country'          => 'sometimes|required|string|max:100',
            'pincode'          => 'sometimes|required|string|max:20',
            'latitude'         => 'sometimes|required|numeric|between:-90,90',
            'longitude'        => 'sometimes|required|numeric|between:-180,180',
            'google_place_id'  => 'nullable|string|max:255',
            'google_plus_code' => 'nullable|string|max:100',
            'timezone'         => 'nullable|string|max:100',
            'status'           => 'boolean',
            'is_default'       => 'boolean',
        ]);

        // 1. Prevent duplicate harbour locations (same coordinates: latitude and longitude)
        if (isset($validated['latitude']) && isset($validated['longitude'])) {
            $lat = (float) $validated['latitude'];
            $lng = (float) $validated['longitude'];
            $coordsExist = Harbour::whereRaw('abs(latitude - ?) < 0.000001', [$lat])
                ->whereRaw('abs(longitude - ?) < 0.000001', [$lng])
                ->where('id', '!=', $id)
                ->exists();
            
            if ($coordsExist) {
                throw ValidationException::withMessages([
                    'latitude' => ['A harbour with these precise coordinates already exists.'],
                ]);
            }
        }

        // 2. Prevent duplicate harbour names within the same district
        $checkName = $validated['harbour_name'] ?? $harbour->harbour_name;
        $checkDistrict = $validated['district'] ?? $harbour->district;
        
        if (isset($validated['harbour_name']) || isset($validated['district'])) {
            $nameExist = Harbour::where('harbour_name', $checkName)
                ->where('district', $checkDistrict)
                ->where('id', '!=', $id)
                ->exists();

            if ($nameExist) {
                throw ValidationException::withMessages([
                    'harbour_name' => ['A harbour with this name already exists within the same district.'],
                ]);
            }
        }

        $harbour->update(\Arr::except($validated, ['is_default']));

        if ($request->has('is_default')) {
            $settings = ShippingSetting::firstOrCreate([]);
            if ($request->boolean('is_default')) {
                $settings->update(['default_harbour_id' => $harbour->id]);
            } elseif ($settings->default_harbour_id === $harbour->id) {
                $settings->update(['default_harbour_id' => null]);
            }
        }

        $settings = ShippingSetting::first();
        $isDefault = ($settings?->default_harbour_id === $harbour->id);

        $response = $harbour->toArray();
        $response['is_default'] = $isDefault;

        return $this->success($response, 'Harbour updated successfully');
    }

    /**
     * Remove the specified harbour from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $harbour = Harbour::findOrFail($id);
        
        // If this harbour was default, remove default harbour link in settings
        $settings = ShippingSetting::first();
        if ($settings && $settings->default_harbour_id === $harbour->id) {
            $settings->update(['default_harbour_id' => null]);
        }

        $harbour->delete();

        return $this->success(null, 'Harbour deleted successfully');
    }
}
