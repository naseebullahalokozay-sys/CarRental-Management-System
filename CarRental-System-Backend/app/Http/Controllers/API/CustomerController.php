<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $customers]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                  => 'required|string|max:255',
            'phone'                 => 'required|string|max:20',
            'tazkira_photo'         => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'photo'                 => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'driving_license_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('tazkira_photo')) {
            $path = $request->file('tazkira_photo')->store('uploads/tazkira', 'public');
            $validated['tazkira_photo'] = $path;
        }

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('uploads/customers_photos', 'public');
            $validated['photo'] = $path;
        }

        if ($request->hasFile('driving_license_photo')) {
            $path = $request->file('driving_license_photo')->store('uploads/driving_licenses', 'public');
            $validated['driving_license_photo'] = $path;
        }

        $customer = Customer::create($validated);

        return response()->json(['message' => 'Customer created.', 'data' => $customer], 201);
    }

    public function show($id)
    {
        $customer = Customer::with('bookings.car')->find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found.'], 404);
        }

        return response()->json(['data' => $customer]);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found.'], 404);
        }

        $validated = $request->validate([
            'name'                  => 'sometimes|string|max:255',
            'phone'                 => 'sometimes|string|max:20',
            'tazkira_photo'         => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'photo'                 => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'driving_license_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('tazkira_photo')) {
            if ($customer->tazkira_photo && Storage::disk('public')->exists($customer->tazkira_photo)) {
                Storage::disk('public')->delete($customer->tazkira_photo);
            }

            $path = $request->file('tazkira_photo')->store('uploads/tazkira', 'public');
            $validated['tazkira_photo'] = $path;
        }

        if ($request->hasFile('photo')) {
            if ($customer->photo && Storage::disk('public')->exists($customer->photo)) {
                Storage::disk('public')->delete($customer->photo);
            }

            $path = $request->file('photo')->store('uploads/customers_photos', 'public');
            $validated['photo'] = $path;
        }

        if ($request->hasFile('driving_license_photo')) {
            if ($customer->driving_license_photo && Storage::disk('public')->exists($customer->driving_license_photo)) {
                Storage::disk('public')->delete($customer->driving_license_photo);
            }

            $path = $request->file('driving_license_photo')->store('uploads/driving_licenses', 'public');
            $validated['driving_license_photo'] = $path;
        }

        $customer->update($validated);

        return response()->json(['message' => 'Customer updated.', 'data' => $customer]);
    }

    public function destroy($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found.'], 404);
        }
        if ($customer->tazkira_photo && Storage::disk('public')->exists($customer->tazkira_photo)) {
            Storage::disk('public')->delete($customer->tazkira_photo);
        }
        if ($customer->photo && Storage::disk('public')->exists($customer->photo)) {
            Storage::disk('public')->delete($customer->photo);
        }
        if ($customer->driving_license_photo && Storage::disk('public')->exists($customer->driving_license_photo)) {
            Storage::disk('public')->delete($customer->driving_license_photo);
        }

        $customer->delete();

        return response()->json(['message' => 'Customer deleted.']);
    }
}