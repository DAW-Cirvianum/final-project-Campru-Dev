<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/drivers",
     *     tags={"Drivers"},
     *     summary="Obtener todos los drivers",
     *     @OA\Response(
     *         response=200,
     *         description="Listado de drivers",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="object")
     *         )
     *     )
     * )
     */
    public function get_drivers($id)
    {

        $laps = Driver::where('race_session_id', $id)->get();

        return response()->json($laps);

    }
}
