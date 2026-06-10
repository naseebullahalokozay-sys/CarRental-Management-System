<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('owner_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('car_owners')->onDelete('cascade');
            $table->decimal('amount_paid', 10, 2);
            $table->date('payment_date');
            $table->decimal('remaining_balance', 10, 2)->default(0);
            $table->string('receipt_no')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('owner_payments');
    }
};