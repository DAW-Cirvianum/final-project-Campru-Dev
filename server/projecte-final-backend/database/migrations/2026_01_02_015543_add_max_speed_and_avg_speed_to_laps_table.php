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
        Schema::table('laps', function (Blueprint $table) {
            // Make columns of max_speed and avg_speed 
            $table->integer('max_speed');
            $table->integer('avg_speed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laps', function (Blueprint $table) {
            // Drop columns max_speed and avg_speed
            $table->dropColumn('max_speed');
            $table->dropColumn('avg_speed');
        });
    }
};
