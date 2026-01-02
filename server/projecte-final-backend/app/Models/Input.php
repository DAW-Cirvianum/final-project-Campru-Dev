<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Input extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'lap_id',
        'd',
        'speed',
        'throttle',
        'brake',
        'gear'
    ];

    public function lap()
    {
        return $this->belongsTo(Lap::class);
    }
}
