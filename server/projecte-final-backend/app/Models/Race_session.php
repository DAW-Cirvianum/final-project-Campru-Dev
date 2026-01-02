<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Race_session extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'track',
        'type',
        'date'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function drivers() {
        return $this->hasMany(Driver::class);
    }

    
}
