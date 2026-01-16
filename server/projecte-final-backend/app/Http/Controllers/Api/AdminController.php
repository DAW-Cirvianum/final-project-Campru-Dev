<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{

    public function viewUsers()
    {
        return response()->json(User::all());
    }

    public function getUser($id) {
        $user = User::where('id', $id)->first();

        return $user;
    }

    public function editUsers()
    {

    }

}
