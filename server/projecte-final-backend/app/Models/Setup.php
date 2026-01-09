<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setup extends Model
{
    
    protected $fillable = [
        'user_id',
        'car_name',
        'track_name',
        'setup_name',
        'type_compound',
        'tyre_pressure_front',
        'tyre_pressure_rear',
        'front_wing',
        'rear_wing',
        'front_arb',
        'rear_arb',
        'ride_height_front',
        'ride_height_rear',
        'camber_front',
        'camber_rear',
        'toe_front',
        'toe_rear',
        'diff_power',
        'diff_coast',
        'diff_preload',
        'brake_bias',
        'brake_power',
        'notes'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

}
