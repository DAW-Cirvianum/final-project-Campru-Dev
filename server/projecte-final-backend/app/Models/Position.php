<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'lap_id',
        'x',
        'y',
        'z'
    ];

    public function lap() {
        return $this->belongsTo(Lap::class);
    }
}
