<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('model');
            $table->string('plate_number')->unique();
            $table->decimal('rate_per_hour', 10, 2)->default(0);
            $table->decimal('rate_per_day', 10, 2)->default(0);
            $table->string('status')->default('available'); // available, rented, maintenance
            $table->foreignId('owner_id')->constrained('car_owners')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};