<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    //
    public function get_drivers($id)
    {

        $laps = Driver::where('race_session_id', $id)->get();

        return response()->json($laps);

    }
}
