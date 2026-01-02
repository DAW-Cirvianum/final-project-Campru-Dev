<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lap;
use Illuminate\Http\Request;

class LapsController extends Controller
{

    public function get_laps($id) {

        $laps = Lap::where('driver_id', $id)->get();

        return response()->json($laps);

    }

}
