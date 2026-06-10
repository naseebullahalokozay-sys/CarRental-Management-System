<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Rental;
use Illuminate\Http\Request;

use function PHPUnit\Framework\equalTo;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['rental.booking.customer', 'rental.booking.car'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['data' => $payments]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rental_id'         => 'required|exists:rentals,id',
            'amount_paid'       => 'required|numeric|min:0',
            'remaining_balance' => 'nullable|numeric|min:0',
            'payment_date'      => 'required|date',
            'payment_method'    => 'in:cash,card,transfer',
        ]);
        $rental = Rental::find($validated['rental_id']);
        $totalPaidSoFar = Payment::where('rental_id', $validated['rental_id'])->sum('amount_paid');
        $netTotal = ($rental->total_amount ?? 0);
        $currentBalance = $netTotal - $totalPaidSoFar;

        if ($currentBalance <= 0) {
            return response()->json([
                'message' => 'This rental is fully paid. You do not have any remaining loan or balance.'
            ], 400);
        }

        if ($validated['amount_paid'] > $currentBalance) {
            return response()->json([
                'message' => "Payment exceeds the remaining balance. You only owe " . number_format($currentBalance, 2)
            ], 400);
        }

        // Auto-calculate remaining_balance
        if (!isset($validated['remaining_balance'])) {
            $rental    = Rental::find($validated['rental_id']);
            $totalPaid = Payment::where('rental_id', $validated['rental_id'])->sum('amount_paid');
            $netTotal  = ($rental->total_amount ?? 0) - ($rental->discount ?? 0) + ($rental->fine_amount ?? 0);
            $validated['remaining_balance'] = round(max(0, $netTotal - $totalPaid - $validated['amount_paid']));
            
        }
       

        $payment = Payment::create($validated);
        $payment->load(['rental.booking.customer']);

        return response()->json(['message' => 'Payment recorded.', 'data' => $payment], 201);
    }

    public function show($id)
    {
        $payment = Payment::with(['rental.booking.customer', 'rental.booking.car'])->find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found.'], 404);
        }

        return response()->json(['data' => $payment]);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found.'], 404);
        }

        $validated = $request->validate([
            'rental_id'         => 'sometimes|required|exists:rentals,id',
            'amount_paid'       => 'sometimes|required|numeric|min:0',
            'remaining_balance' => 'nullable|numeric|min:0',
            'payment_date'      => 'sometimes|required|date',
            'payment_method'    => 'sometimes|in:cash,card,transfer',
        ]);

        $payment->update($validated);

        return response()->json(['message' => 'Payment updated.', 'data' => $payment]);
    }

    public function destroy(string $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found.'], 404);
        }

        $payment->delete();

        return response()->json(['message' => 'Payment deleted.']);
    }
}