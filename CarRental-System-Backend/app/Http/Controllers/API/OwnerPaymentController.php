<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CarOwner;
use App\Models\OwnerPayment;
use Illuminate\Http\Request;

class OwnerPaymentController extends Controller
{
    public function index()
    {
        $payments = OwnerPayment::with('owner')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['data' => $payments]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'owner_id'          => 'required|exists:car_owners,id',
            'amount_paid'       => 'required|numeric|min:0',
            'payment_date'      => 'required|date',
            'remaining_balance' => 'nullable|numeric|min:0',
            'receipt_no'        => 'required|string|max:100|unique:owner_payments,receipt_no',
        ]);
        $owner = CarOwner::findOrFail($validated['owner_id']);
        $totalPaid = OwnerPayment::where('owner_id', $validated['owner_id'])
        ->sum('amount_paid');
        $totalPaid += $validated['amount_paid'];
        $totalDue = $owner->total_amount ?? 0;
        $remainingBalance = $totalDue - $totalPaid;
        
        if ($remainingBalance < 0) {
          $remainingBalance = 0;
        }

        $payment = OwnerPayment::create([
        'owner_id'          => $validated['owner_id'],
        'amount_paid'       => $validated['amount_paid'],
        'payment_date'      => $validated['payment_date'],
        'receipt_no'        => $validated['receipt_no'],
        'remaining_balance' => $remainingBalance,
        ]);
        $payment->load('owner');

        return response()->json(['message' => 'Owner payment recorded.', 'data' => $payment], 201);
    }

    public function show($id)
    {
        $payment = OwnerPayment::with('owner')->find($id);

        if (!$payment) {
            return response()->json(['message' => 'Owner payment not found.'], 404);
        }

        return response()->json(['data' => $payment]);
    }

    public function update(Request $request, $id)
    {
        $payment = OwnerPayment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Owner payment not found.'], 404);
        }

        $validated = $request->validate([
            'owner_id'          => 'sometimes|required|exists:car_owners,id',
            'amount_paid'       => 'sometimes|required|numeric|min:0',
            'payment_date'      => 'sometimes|required|date',
            'remaining_balance' => 'nullable|numeric|min:0',
            'receipt_no'        => 'sometimes|required|string|max:100|unique:owner_payments,receipt_no,' . $id,
        ]);

        $payment->update($validated);
        $payment->load('owner');

        return response()->json(['message' => 'Owner payment updated.', 'data' => $payment]);
    }

    public function destroy($id)
    {
        $payment = OwnerPayment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Owner payment not found.'], 404);
        }

        $payment->delete();

        return response()->json(['message' => 'Owner payment deleted.']);
    }
}