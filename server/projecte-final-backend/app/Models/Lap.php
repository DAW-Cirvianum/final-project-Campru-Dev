<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lap extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'driver_id',
        'lap_number',
        'lap_time',
        'max_speed',
        'avg_speed',
        'max_rpm',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function position() {
        return $this->hasMany(Position::class);
    }

    public function input() {
        return $this->hasMany(Input::class);
    }

}
