<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of areas.
     */
    public function index(): JsonResponse
    {
        $areas = Area::orderBy('name', 'asc')->get();
        return $this->success($areas, 'Areas retrieved successfully');
    }

    /**
     * Store a newly created area.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255|unique:areas,name',
            'shipping_price' => 'required|numeric|min:0',
        ]);

        $area = Area::create($validated);

        return $this->created($area, 'Area created successfully');
    }

    /**
     * Display the specified area.
     */
    public function show(string $id): JsonResponse
    {
        $area = Area::findOrFail($id);
        return $this->success($area, 'Area retrieved successfully');
    }

    /**
     * Update the specified area.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $area = Area::findOrFail($id);

        $validated = $request->validate([
            'name'           => 'sometimes|required|string|max:255|unique:areas,name,' . $id,
            'shipping_price' => 'sometimes|required|numeric|min:0',
        ]);

        $area->update($validated);

        return $this->success($area, 'Area updated successfully');
    }

    /**
     * Remove the specified area.
     */
    public function destroy(string $id): JsonResponse
    {
        $area = Area::findOrFail($id);
        $area->delete();

        return $this->success(null, 'Area deleted successfully');
    }
}
