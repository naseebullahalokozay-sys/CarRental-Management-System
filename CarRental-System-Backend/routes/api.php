<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AdminAuthController;
use App\Http\Controllers\API\CarOwnerController;
use App\Http\Controllers\API\CarController;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\RentalController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\GuaranteeController;
use App\Http\Controllers\API\OwnerPaymentController;
use App\Http\Controllers\DashboardController;

// Admin Authentication
Route::post('/admin/register',        [AdminAuthController::class, 'register']);
Route::post('/admin/login',           [AdminAuthController::class, 'login']);
Route::post('/admin/logout',          [AdminAuthController::class, 'logout']);
Route::get('/admin/me',               [AdminAuthController::class, 'me']);

// Car Owners
Route::get('/car-owners',             [CarOwnerController::class, 'index']);
Route::post('/car-owners',            [CarOwnerController::class, 'store']);
Route::get('/car-owners/{id}',        [CarOwnerController::class, 'show']);
Route::put('/car-owners/{id}',        [CarOwnerController::class, 'update']);
Route::delete('/car-owners/{id}',     [CarOwnerController::class, 'destroy']);

// Cars
Route::get('/cars/available',         [CarController::class, 'available']);
Route::get('/cars',                   [CarController::class, 'index']);
Route::post('/cars',                  [CarController::class, 'store']);
Route::get('/cars/{id}',              [CarController::class, 'show']);
Route::put('/cars/{id}',              [CarController::class, 'update']);
// Route::post('/cars/{id}',          [CarController::class, 'update']);
Route::delete('/cars/{id}',           [CarController::class, 'destroy']);
Route::get('/car-statuses',           [CarController::class, 'statuses']);        

// Customers
Route::get('/customers',              [CustomerController::class, 'index']);
Route::post('/customers',             [CustomerController::class, 'store']);
Route::get('/customers/{id}',         [CustomerController::class, 'show']);
Route::put('/customers/{id}',         [CustomerController::class, 'update']);
Route::delete('/customers/{id}',      [CustomerController::class, 'destroy']);

// Bookings
Route::get('/bookings',               [BookingController::class, 'index']);
Route::post('/bookings',              [BookingController::class, 'store']);
Route::get('/bookings/{id}',          [BookingController::class, 'show']);
Route::put('/bookings/{id}',          [BookingController::class, 'update']);
Route::delete('/bookings/{id}',       [BookingController::class, 'destroy']);

// Rentals
Route::get('/rentals',                [RentalController::class, 'index']);
Route::post('/rentals',               [RentalController::class, 'store']);
Route::get('/rentals/{id}',           [RentalController::class, 'show']);
Route::put('/rentals/{id}',           [RentalController::class, 'update']);
Route::delete('/rentals/{id}',        [RentalController::class, 'destroy']);
Route::patch('/rentals/{id}/end',      [RentalController::class, 'end']);

// Payments
Route::get('/payments',               [PaymentController::class, 'index']);
Route::post('/payments',              [PaymentController::class, 'store']);
Route::get('/payments/{id}',          [PaymentController::class, 'show']);
Route::put('/payments/{id}',          [PaymentController::class, 'update']);
Route::delete('/payments/{id}',       [PaymentController::class, 'destroy']);

// Guarantees
Route::get('/guarantees',             [GuaranteeController::class, 'index']);
Route::post('/guarantees',            [GuaranteeController::class, 'store']);
Route::get('/guarantees/{id}',        [GuaranteeController::class, 'show']);
Route::put('/guarantees/{id}',        [GuaranteeController::class, 'update']);
Route::delete('/guarantees/{id}',     [GuaranteeController::class, 'destroy']);

// Owner Payments
Route::get('/owner-payments',         [OwnerPaymentController::class, 'index']);
Route::post('/owner-payments',        [OwnerPaymentController::class, 'store']);
Route::get('/owner-payments/{id}',    [OwnerPaymentController::class, 'show']);
Route::put('/owner-payments/{id}',    [OwnerPaymentController::class, 'update']);
Route::delete('/owner-payments/{id}', [OwnerPaymentController::class, 'destroy']);

// Dashboard 

Route::prefix('dashboard')->group(function () {
    Route::get('/stats',              [DashboardController::class, 'stats']);
    Route::get('/recent-bookings',    [DashboardController::class, 'recentBookings']);
    Route::get('/recent-payments',    [DashboardController::class, 'recentPayments']);
});