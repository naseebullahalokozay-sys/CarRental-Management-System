<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CarOwner;
use Illuminate\Http\Request;

class CarOwnerController extends Controller
{
    public function index()
    {
        $owners = CarOwner::with('cars')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $owners]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'required|string|max:20',
            'address' => 'nullable|string',
        ]);

        $owner = CarOwner::create($validated);

        return response()->json(['message' => 'Car owner created.', 'data' => $owner], 201);
    }

    public function show($id)
    {
        $owner = CarOwner::with(['cars', 'ownerPayments'])->find($id);

        if (!$owner) {
            return response()->json(['message' => 'Car owner not found.'], 404);
        }

        return response()->json(['data' => $owner]);
    }

    public function update(Request $request, $id)
    {
        $owner = CarOwner::find($id);

        if (!$owner) {
            return response()->json(['message' => 'Car owner not found.'], 404);
        }

        $validated = $request->validate([
            'name'    => 'sometimes|required|string|max:255',
            'phone'   => 'sometimes|required|string|max:20',
            'address' => 'nullable|string',
        ]);

        $owner->update($validated);

        return response()->json(['message' => 'Car owner updated.', 'data' => $owner]);
    }

    public function destroy($id)
    {
        $owner = CarOwner::find($id);

        if (!$owner) {
            return response()->json(['message' => 'Car owner not found.'], 404);
        }

        $owner->delete();

        return response()->json(['message' => 'Car owner deleted.']);
    }
}