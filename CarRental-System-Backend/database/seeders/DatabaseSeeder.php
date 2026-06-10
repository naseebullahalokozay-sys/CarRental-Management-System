<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\CarOwner;
use App\Models\Car;
use App\Models\Customer;
use App\Models\Booking;
use App\Models\Rental;
use App\Models\Payment;
use App\Models\Guarantee;
use App\Models\OwnerPayment;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admins
        Admin::create(['username' => 'admin', 'password' => Hash::make('admin123')]);
        Admin::create(['username' => 'manager', 'password' => Hash::make('manager123')]);

        // Car Owners
        $owners = [
            ['name' => 'Ahmad Karimi',   'phone' => '0700123456', 'address' => 'Kabul, District 3'],
            ['name' => 'Rahul Siddiqui', 'phone' => '0701234567', 'address' => 'Kabul, District 7'],
            ['name' => 'Farida Ahmadi',  'phone' => '0702345678', 'address' => 'Mazar-i-Sharif, Zone 2'],
            ['name' => 'Omar Wardak',    'phone' => '0703456789', 'address' => 'Herat, District 1'],
        ];
        foreach ($owners as $o) { CarOwner::create($o); }

        // Cars
        $cars = [
            ['image' => 'Image 1', 'model' => 'Toyota Corolla 2020',  'plate_number' => 'KBL-1234', 'rate_per_hour' => 5,  'rate_per_day' => 80,  'status' => 'available',   'owner_id' => 1],
            ['image' => 'Image 2', 'model' => 'Toyota Land Cruiser',   'plate_number' => 'KBL-5678', 'rate_per_hour' => 15, 'rate_per_day' => 200, 'status' => 'available',   'owner_id' => 1],
            ['image' => 'Image 3', 'model' => 'Honda Civic 2021',      'plate_number' => 'KBL-9012', 'rate_per_hour' => 6,  'rate_per_day' => 90,  'status' => 'rented',      'owner_id' => 2],
            ['image' => 'Image 4', 'model' => 'Ford F-150 2019',       'plate_number' => 'KBL-3456', 'rate_per_hour' => 10, 'rate_per_day' => 150, 'status' => 'available',   'owner_id' => 2],
            ['image' => 'Image 5', 'model' => 'Hyundai Tucson 2022',   'plate_number' => 'KBL-7890', 'rate_per_hour' => 8,  'rate_per_day' => 120, 'status' => 'maintenance', 'owner_id' => 3],
            ['image' => 'Image 6', 'model' => 'Nissan Patrol 2020',    'plate_number' => 'KBL-2345', 'rate_per_hour' => 18, 'rate_per_day' => 250, 'status' => 'available',   'owner_id' => 4],
        ];
        foreach ($cars as $c) { Car::create($c); }

        // Customers
        $customers = [
            ['name' => 'Ali Hassan',    'phone' => '0710111222', 'tazkira_photo' => 'tazkira_1.jpg', 'photo' => 'photo_1.jpg', 'driving_license_photo' => 'license_1.jpg'],
            ['name' => 'Sara Noori',    'phone' => '0711222333', 'tazkira_photo' => 'tazkira_2.jpg', 'photo' => 'photo_2.jpg', 'driving_license_photo' => 'license_2.jpg'],
            ['name' => 'Karim Barakzai','phone' => '0712333444', 'tazkira_photo' => 'tazkira_3.jpg', 'photo' => 'photo_3.jpg', 'driving_license_photo' => 'license_3.jpg'],
            ['name' => 'Layla Samimi',  'phone' => '0713444555', 'tazkira_photo' => 'tazkira_4.jpg', 'photo' => 'photo_4.jpg', 'driving_license_photo' => 'license_4.jpg'],
            ['name' => 'Dawod Sultani', 'phone' => '0714555666', 'tazkira_photo' => 'tazkira_5.jpg', 'photo' => 'photo_5.jpg', 'driving_license_photo' => 'license_5.jpg'],
        ];
        foreach ($customers as $c) { Customer::create($c); }

        // Bookings
        $bookings = [
            ['customer_id' => 1, 'car_id' => 3, 'booking_date' => '2024-01-10', 'status' => 'completed'],
            ['customer_id' => 2, 'car_id' => 1, 'booking_date' => '2024-01-15', 'status' => 'confirmed'],
            ['customer_id' => 3, 'car_id' => 4, 'booking_date' => '2024-01-20', 'status' => 'pending'],
            ['customer_id' => 4, 'car_id' => 2, 'booking_date' => '2024-01-22', 'status' => 'confirmed'],
            ['customer_id' => 5, 'car_id' => 6, 'booking_date' => '2024-01-25', 'status' => 'cancelled'],
        ];
        foreach ($bookings as $b) { Booking::create($b); }

        // Rentals
        Rental::create([
            'booking_id'   => 1,
            'start_time'   => '2024-01-10 08:00:00',
            'end_time'     => '2024-01-12 10:00:00',
            'total_hours'  => 50,
            'total_amount' => 300.00,
            'discount'     => 20.00,
            'fine_amount'  => 0.00,
        ]);
        Rental::create([
            'booking_id'   => 2,
            'start_time'   => '2024-01-15 09:00:00',
            'end_time'     => null,
            'total_hours'  => 0,
            'total_amount' => 0,
            'discount'     => 0,
            'fine_amount'  => 0,
        ]);

        // Payments
        Payment::create([
            'rental_id'         => 1,
            'amount_paid'       => 200.00,
            'remaining_balance' => 80.00,
            'payment_date'      => '2024-01-12',
            'payment_method'    => 'cash',
        ]);
        Payment::create([
            'rental_id'         => 1,
            'amount_paid'       => 80.00,
            'remaining_balance' => 0.00,
            'payment_date'      => '2024-01-14',
            'payment_method'    => 'card',
        ]);

        // Guarantees
        Guarantee::create([
            'booking_id'  => 1,
            'type'        => 'cash',
            'description' => 'Cash guarantee of 500 AFN held at office',
            'photo'       => null,
            'status'      => 'returned',
        ]);
        Guarantee::create([
            'booking_id'  => 2,
            'type'        => 'document',
            'description' => 'National ID copy held as guarantee',
            'photo'       => 'guarantee_doc_2.jpg',
            'status'      => 'held',
        ]);

        // Owner Payments
        OwnerPayment::create([
            'owner_id'          => 1,
            'amount_paid'       => 250.00,
            'payment_date'      => '2024-01-13',
            'remaining_balance' => 50.00,
            'receipt_no'        => 'RCP-2024-001',
        ]);
        OwnerPayment::create([
            'owner_id'          => 2,
            'amount_paid'       => 130.00,
            'payment_date'      => '2024-01-16',
            'remaining_balance' => 0.00,
            'receipt_no'        => 'RCP-2024-002',
        ]);
    }
}