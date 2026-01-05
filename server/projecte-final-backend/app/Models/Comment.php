<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{

    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'forum_id',
        'user_id',
        'content',
        'reply_to'
    ];

    public function forum () {
        return $this->belongsTo(Forum::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
