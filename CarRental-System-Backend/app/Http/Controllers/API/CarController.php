<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    public function index()
    {
        $cars = Car::with('owner')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $cars]);
    }

    public function available()
    {
        $cars = Car::with('owner')->where('status', 'available')->get();
        return response()->json(['data' => $cars]);
    }
    // for car status dropdown in frontend
   public function statuses()
   {
    return response()->json([
        'data' => [
            ['value' => 'available', 'label' => 'Available'],
            ['value' => 'unavailable', 'label' => 'Unavailable'],
            ['value' => 'rented', 'label' => 'Rented'],
        ]
    ]);
   }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image'         => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'model'         => 'required|string|max:255',
            'plate_number'  => 'required|string|max:50|unique:cars,plate_number',
            'rate_per_hour' => 'required|numeric|min:0',
            'rate_per_day'  => 'required|numeric|min:0',
            'status'        => 'in:available,rented,unavailable',
            'owner_id'      => 'required|exists:car_owners,id',
        ]);

        if ($request->hasFile('image')) {
        $path = $request->file('image')->store('uploads/cars', 'public');
        $validated['image'] = $path;

        }
        $car = Car::create($validated);
        $car->load('owner');


        return response()->json(['message' => 'Car created.', 'data' => $car], 201);
    }

    public function show(string $id)
    {
        $car = Car::with(['owner', 'bookings.customer'])->find($id);
        if (!$car)
        {
            return response()->json(['message' => 'Car not found.'], 404);
        }
        return response()->json(['data' => $car]);
    }

   public function update(Request $request,string $id)
   {
        $car = Car::findOrFail($id);

        $validated = $request->validate([
        'image'         => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        'model'         => 'sometimes|string|max:255',
        'plate_number'  => 'sometimes|string|max:50|unique:cars,plate_number,' . $id,
        'rate_per_hour' => 'sometimes|numeric|min:0',
        'rate_per_day'  => 'sometimes|numeric|min:0',
        'status'        => 'sometimes|in:available,rented,unavailable',
        'owner_id'      => 'sometimes|exists:car_owners,id',
    ]);

    if ($request->hasFile('image')) 
    {
        if ($car->image && Storage::disk('public')->exists($car->image))
        {
            Storage::disk('public')->delete($car->image);
        }
        $path = $request->file('image')->store('uploads/cars', 'public');
        $validated['image'] = $path;
    }
        $car->update($validated);

        return response()->json(
            [
            'message' => 'Car updated.',
            'data' => $car->fresh()
            ]
            );
    }

    public function destroy(string $id)
    {
        $car = Car::find($id);


        if (!$car) {
            return response()->json(['message' => 'Car not found.'], 404);
        }
        if ($car->image && Storage::disk('public')->exists($car->image)) {
        Storage::disk('public')->delete($car->image);
    }

        $car->delete();

        return response()->json(['message' => 'Car deleted.']);
    }
}