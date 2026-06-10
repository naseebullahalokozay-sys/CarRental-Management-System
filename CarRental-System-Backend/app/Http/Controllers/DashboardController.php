<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Car;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Rental;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalCars' => Car::count(),
            'totalCustomers' => Customer::count(),
            'activeRentals' => Rental::whereNull('end_time')->count(),
            'totalRevenue' => Payment::sum('amount_paid'),
        ]);
    }

    public function recentBookings()
    {
        $bookings = Booking::with(['customer', 'car'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'customer' => $b->customer->name ?? 'N/A',
                    'car' => $b->car->model ?? 'N/A',
                    'date' => $b->booking_date,
                    'status' => $b->status,
                ];
            });

        return response()->json($bookings);
    }

    public function recentPayments()
    {
        $payments = Payment::with('rental.booking.customer')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'customer' => $p->rental->booking->customer->name ?? 'N/A',
                    'amount' => $p->amount_paid,
                    'date' => $p->payment_date,
                    'method' => $p->payment_method,
                ];
            });

        return response()->json($payments);
    }
}
