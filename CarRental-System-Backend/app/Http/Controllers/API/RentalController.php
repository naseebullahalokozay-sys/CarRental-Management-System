<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RentalController extends Controller
{
    public function index()
    {
        $rentals = Rental::with(['booking.customer', 'booking.car', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['data' => $rentals]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id'   => 'required|exists:bookings,id|unique:rentals,booking_id',
            'start_time'   => 'required|date',
            'end_time'     => 'nullable|date|after:start_time',
            'total_hours'  => 'nullable|numeric|min:0',
            'total_amount' => 'nullable|numeric|min:0',
            'discount'     => 'nullable|numeric|min:0',
            'fine_amount'  => 'nullable|numeric|min:0',
        ]);


        $rental = Rental::create($validated);
         $rental->update([
            'status' => 'active',
        ]);
        $rental->load(['booking.customer', 'booking.car']);

        return response()->json(['message' => 'Rental created.', 'data' => $rental], 201);
    }

    public function show(int $id)
    {
        $rental = Rental::with(['booking.customer', 'booking.car.owner', 'payments'])->find($id);

        if (!$rental) {
            return response()->json(['message' => 'Rental not found.'], 404);
        }

        return response()->json(['data' => $rental]);
    }

    public function update(Request $request, $id)
    {
        $rental = Rental::find($id);

        if (!$rental) {
            return response()->json(['message' => 'Rental not found.'], 404);
        }

        $validated = $request->validate([
            'start_time'   => 'sometimes|required|date',
            'end_time'     => 'nullable|date',
            'total_hours'  => 'nullable|numeric|min:0',
            'total_amount' => 'nullable|numeric|min:0',
            'discount'     => 'nullable|numeric|min:0',
            'fine_amount'  => 'nullable|numeric|min:0',
        ]);

        $rental->update($validated);
        $rental->load(['booking.customer', 'booking.car', 'payments']);

        return response()->json(['message' => 'Rental updated.', 'data' => $rental]);
    }

    public function destroy($id)
    {
        $rental = Rental::find($id);

        if (!$rental) {
            return response()->json(['message' => 'Rental not found.'], 404);
        }

        $rental->delete();

        return response()->json(['message' => 'Rental deleted.']);
    }


    public function end(Request $request, $id)
    {
        $request->validate([
            'end_time' => 'required|date',
            'discount' => 'nullable|numeric|min:0',
            'fine_amount' => 'nullable|numeric|min:0',
        ]);

        $rental = Rental::with('booking.car')->findOrFail($id);

        $startTime = Carbon::parse($rental->start_time);
        $endTime = Carbon::parse($request->end_time);

        if ($endTime->lessThan($startTime)) {
            return response()->json([
                'message' => 'End time must be after start time'
            ], 400);
        }

        
        $hours = round($startTime->diffInMinutes($endTime) / 60, 2);
        $rate = $rental->booking->car->rate_per_hour;
        $total = $hours * $rate;
        $discount = $request->discount ?? 0;
        $fine = $request->fine_amount ?? 0;
        $finalAmount = $total - $discount + $fine;

        $rental->update([
            'end_time' => $endTime,
            'total_hours' => $hours,
            'total_amount' => $finalAmount,
            'discount' => $discount,
            'fine_amount' => $fine,
        ]);
        $rental->booking->update(['status' => 'completed']);

        return response()->json([
            'message' => 'Rental completed',
            'data' => $rental
        ]);
   }
}