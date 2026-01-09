<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setup;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SetupController extends Controller
{
    public function getSetups()
    {
        $setups = Setup::all();

        return $setups;
    }

    public function getSetup($id)
    {
        $setup = Setup::find($id);

        return $setup;
    }

    public function addSetup(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'carName' => 'required|string',
            'trackName' => 'required|string',
            'setupName' => 'required|string',
            'type_compound' => 'required|string',

            'front_pressure' => 'required|decimal:1,2',
            'rear_pressure' => 'required|decimal:1,2',

            'front_wing' => 'required|integer',
            'rear_wing' => 'required|integer',
            'front_ARB' => 'required|integer',
            'rear_ARB' => 'required|integer',
            'ride_height_front' => 'required|integer',
            'ride_height_rear' => 'required|integer',

            'front_camber' => 'required|decimal:1,2',
            'rear_camber' => 'required|decimal:1,2',
            'front_toe' => 'required|decimal:1,2',
            'rear_toe' => 'required|decimal:1,2',

            'differential_power' => 'required|integer',
            'differential_coast' => 'required|integer',

            'brake_bias' => 'required|decimal:1,2',
            'brake_power' => 'required|integer',
        ]);

        // Returning error when 
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Getting the validated data
        $data = $validator->validated();

        $userID = Auth::user()->id;

        $setup = Setup::create([
            'user_id' => $userID,
            'car_name' => $data['carName'],
            'track_name' => $data['trackName'],
            'setup_name' => $data['setupName'],
            'type_compound' => $data['type_compound'],
            'tyre_pressure_front' => $data['front_pressure'],
            'tyre_pressure_rear' => $data['rear_pressure'],
            'front_wing' => $data['front_wing'],
            'rear_wing' => $data['rear_wing'],
            'front_arb' => $data['front_ARB'],
            'rear_arb' => $data['rear_ARB'],
            'ride_height_front' => $data['ride_height_front'],
            'ride_height_rear' => $data['ride_height_rear'],
            'camber_front' => $data['front_camber'],
            'camber_rear' => $data['rear_camber'],
            'toe_front' => $data['front_toe'],
            'toe_rear' => $data['rear_toe'],
            'diff_power' => $data['differential_power'],
            'diff_coast' => $data['differential_coast'],
            'brake_bias' => $data['brake_bias'],
            'brake_power' => $data['brake_power']
        ]);

        return response()->json(
            [
                "data" => $data
            ]
        );

    }
}
