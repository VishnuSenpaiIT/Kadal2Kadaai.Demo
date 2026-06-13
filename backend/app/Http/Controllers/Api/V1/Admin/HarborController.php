<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HarborController extends Controller
{
    public function index()
    {
        $harbors = \App\Models\Harbor::all();
        return response()->json(['data' => $harbors]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'city' => 'nullable|string|max:255',
            'pincode' => 'nullable|string|max:20',
        ]);

        $harbor = \App\Models\Harbor::create($validated);

        return response()->json([
            'message' => 'Harbor created successfully',
            'data' => $harbor
        ], 201);
    }

    public function show(string $id)
    {
        $harbor = \App\Models\Harbor::findOrFail($id);
        return response()->json(['data' => $harbor]);
    }

    public function update(Request $request, string $id)
    {
        $harbor = \App\Models\Harbor::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'city' => 'nullable|string|max:255',
            'pincode' => 'nullable|string|max:20',
        ]);

        $harbor->update($validated);

        return response()->json([
            'message' => 'Harbor updated successfully',
            'data' => $harbor
        ]);
    }

    public function destroy(string $id)
    {
        $harbor = \App\Models\Harbor::findOrFail($id);
        $harbor->delete();

        return response()->json([
            'message' => 'Harbor deleted successfully'
        ]);
    }
}
