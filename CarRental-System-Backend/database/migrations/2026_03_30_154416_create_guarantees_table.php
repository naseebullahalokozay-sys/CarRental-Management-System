<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guarantees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->string('type'); // cash, property, document
            $table->text('description')->nullable();
            $table->string('photo')->nullable();
            $table->string('status')->default('held'); // held, returned, forfeited
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guarantees');
    }
};