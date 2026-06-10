<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Guarantee;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class GuaranteeController extends Controller
{
    public function index()
    {
        $guarantees = Guarantee::with(['booking.customer', 'booking.car'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['data' => $guarantees]);
    }
    // in:cash,property,document
    public function store(Request $request)
    {

        $validated = $request->validate([
            'booking_id'  => 'required|exists:bookings,id',
            'type'        => 'required|string|in:item,guarantor,document,cash,property',
            'description' => 'nullable|string',
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status'      => 'in:locked,released',
        ]);

        if($request->hasFile("photo")){
            $path = $request->file('photo')->store("uploads/guarantees", 'public');
            $validated["photo"] = $path;
        }
        $guarantee = Guarantee::create($validated);
        $guarantee->load(['booking.customer', 'booking.car']);

        return response()->json(['message' => 'Guarantee created.', 'data' => $guarantee], 201);
    }

    public function show($id)
    {
        $guarantee = Guarantee::with(['booking.customer', 'booking.car'])->find($id);

        if (!$guarantee) {
            return response()->json(['message' => 'Guarantee not found.'], 404);
        }

        return response()->json(['data' => $guarantee]);
    }

    public function update(Request $request, $id)
    {
        $guarantee = Guarantee::find($id);

        if (!$guarantee) {
            return response()->json(['message' => 'Guarantee not found.'], 404);
        }

        $validated = $request->validate([
            'booking_id'  => 'sometimes|exists:bookings,id',
            'type'        => 'sometimes|string|in:cash,property,document,guarantor,item',
            'description' => 'nullable|string',
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg|max:500',
            'status'      => 'sometimes|in:locked,released',
        ]);
        if($request->hasFile('photo')){
            if($guarantee->photo && Storage::disk("public")->exists($guarantee->photo)){
                Storage::disk('public')->delete($guarantee->photo);
            }
            $path = $request->file('photo')->store('uploads/guarantees', 'public');
            $validated['photo'] = $path;
        }
        $guarantee->update($validated);
        $guarantee->load(['booking.customer', 'booking.car']);

        return response()->json(['message' => 'Guarantee updated.', 'data' => $guarantee->refresh()]);
    }

    public function destroy($id)
    {
        $guarantee = Guarantee::find($id);

        if (!$guarantee) {
            return response()->json(['message' => 'Guarantee not found.'], 404);
        }
        if($guarantee->photo && Storage::disk("public")->exists($guarantee->photo)){
            Storage::disk("public")->delete($guarantee->photo);
        }

        $guarantee->delete();

        return response()->json(['message' => 'Guarantee deleted.']);
    }
}