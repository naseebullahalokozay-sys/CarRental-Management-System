<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Car;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['customer', 'car.owner'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['data' => $bookings]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id'  => 'required|exists:customers,id',
            'car_id'       => 'required|exists:cars,id',
            'booking_date' => 'required|date',
            'status'       => 'in:pending,confirmed,cancelled,completed',
        ]);

        $car = Car::find($validated['car_id']);
        if ($car->status !== 'available') {
            return response()->json(['message' => 'Car is not available for booking.'], 422);
        }

        $booking = Booking::create($validated);

        if (($validated['status'] ?? 'pending') === 'confirmed') {
            $car->update(['status' => 'rented']);
        }

        $booking->load(['customer', 'car.owner']);

        return response()->json(['message' => 'Booking created.', 'data' => $booking], 201);
    }

    public function show($id)
    {
        $booking = Booking::with(['customer', 'car.owner', 'rental.payments', 'guarantee'])->find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found.'], 404);
        }

        return response()->json(['data' => $booking]);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found.'], 404);
        }

        $validated = $request->validate([
            'customer_id'  => 'sometimes|required|exists:customers,id',
            'car_id'       => 'sometimes|required|exists:cars,id',
            'booking_date' => 'sometimes|required|date',
            'status'       => 'sometimes|in:pending,confirmed,cancelled,completed',
        ]);

        $booking->update($validated);

        if (isset($validated['status'])) {
            $car = Car::find($booking->car_id);
            if ($validated['status'] === 'confirmed') {
                $car->update(['status' => 'rented']);
            } elseif (in_array($validated['status'], ['cancelled', 'completed'])) {
                $car->update(['status' => 'available']);
            }
        }

        $booking->load(['customer', 'car.owner']);

        return response()->json(['message' => 'Booking updated.', 'data' => $booking]);
    }

    public function destroy($id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found.'], 404);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking deleted.']);
    }
}