<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Consumer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()->addresses()->latest()->get();
        return $this->successResponse($addresses, 'Addresses retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name'             => 'required|string|max:255',
            'mobile_number'         => 'required|string|max:50',
            'house_flat_number'     => 'required|string|max:100',
            'street_name'           => 'required|string|max:255',
            'area_locality'         => 'required|string|max:255',
            'landmark'              => 'nullable|string|max:255',
            'city'                  => 'required|string|max:100',
            'district'              => 'required|string|max:100',
            'state'                 => 'required|string|max:100',
            'pincode'               => 'required|string|max:20',
            'latitude'              => 'required|numeric|between:-90,90',
            'longitude'             => 'required|numeric|between:-180,180',
            'address_type'          => 'required|string|in:Home,Work,Other',
            'delivery_instructions' => 'nullable|string|max:5000',
            'is_default'            => 'boolean',
        ]);

        $user = $request->user();

        if (!empty($validated['is_default'])) {
            $user->addresses()->update(['is_default' => false]);
        }

        // First address is always default
        if ($user->addresses()->count() === 0) {
            $validated['is_default'] = true;
        }

        $address = $user->addresses()->create($validated);

        return $this->successResponse($address, 'Address saved', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $validated = $request->validate([
            'full_name'             => 'sometimes|required|string|max:255',
            'mobile_number'         => 'sometimes|required|string|max:50',
            'house_flat_number'     => 'sometimes|required|string|max:100',
            'street_name'           => 'sometimes|required|string|max:255',
            'area_locality'         => 'sometimes|required|string|max:255',
            'landmark'              => 'nullable|string|max:255',
            'city'                  => 'sometimes|required|string|max:100',
            'district'              => 'sometimes|required|string|max:100',
            'state'                 => 'sometimes|required|string|max:100',
            'pincode'               => 'sometimes|required|string|max:20',
            'latitude'              => 'sometimes|required|numeric|between:-90,90',
            'longitude'             => 'sometimes|required|numeric|between:-180,180',
            'address_type'          => 'sometimes|required|string|in:Home,Work,Other',
            'delivery_instructions' => 'nullable|string|max:5000',
            'is_default'            => 'boolean',
        ]);

        if (!empty($validated['is_default'])) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address->update($validated);

        return $this->successResponse($address, 'Address updated');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $address = $request->user()->addresses()->findOrFail($id);

        // Fix 10: Prevent deletion if this address is referenced by any orders
        if (\App\Models\Order::where('address_id', $address->id)->exists()) {
            return $this->errorResponse(
                'This address cannot be deleted because it is linked to one or more orders. You can add a new address instead.',
                422
            );
        }

        $address->delete();

        // Assign a new default if needed
        if ($address->is_default) {
            $request->user()->addresses()->latest()->first()?->update(['is_default' => true]);
        }

        return $this->successResponse(null, 'Address deleted');
    }
}
