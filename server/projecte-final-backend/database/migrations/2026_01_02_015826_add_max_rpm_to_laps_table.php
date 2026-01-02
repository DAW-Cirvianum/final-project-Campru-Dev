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
            // Add max_rpm column
            $table->integer('max_rpm');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laps', function (Blueprint $table) {
            // Drop column max_rpm
            $table->dropColumn('max_rpm');
        });
    }
};
