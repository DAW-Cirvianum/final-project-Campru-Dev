<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('setups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('car_name');
            $table->string('track_name');
            $table->string('setup_name');
            // Tyres
            $table->string('type_compound');
            $table->decimal('tyre_pressure_front');
            $table->decimal('tyre_pressure_rear');
            // Aerodinamic
            $table->integer('front_wing');
            $table->integer('rear_wing');
            // Suspension
            $table->integer('front_arb');
            $table->integer('rear_arb');
            $table->integer('ride_height_front');
            $table->integer('ride_height_rear');
            // Alineation
            $table->decimal('camber_front');
            $table->decimal('camber_rear');
            $table->decimal('toe_front');
            $table->decimal('toe_rear');
            // Diferential
            $table->integer('diff_power');
            $table->integer('diff_coast');
            // Brake
            $table->decimal('brake_bias');
            $table->integer('brake_power');
            // Notes 
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setups');
    }
};
