<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    
    public function viewUsers() {
        return view('welcome');
    }

    public function editUsers() {

    }

}
