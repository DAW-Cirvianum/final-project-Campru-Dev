<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'race_session_id',
        'driverName',
        'carName',
    ];

    public function raceSession() {
        return $this->belongsTo(Race_session::class);
    }

    public function laps() {
        return $this->hasMany(Lap::class);
    }



}
