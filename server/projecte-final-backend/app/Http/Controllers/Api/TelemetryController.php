<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Input;
use App\Models\Position;
use Illuminate\Http\Request;

class TelemetryController extends Controller
{
    
    public function get_telemetry($id) {

        $inputs = Input::where('lap_id', $id)->get();
        $postions = Position::where('lap_id', $id)->get();

        return response()->json([
            'inputs' => $inputs,
            'positions' => $postions
        ]);

    }

}
