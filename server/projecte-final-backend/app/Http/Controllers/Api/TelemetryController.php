<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Input;
use App\Models\Position;
use Illuminate\Http\Request;

class TelemetryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/laps/{id}/telemetry",
     *     tags={"Telemetry"},
     *     summary="Obtener telemetría de una vuelta",
     *     description="Devuelve los inputs y posiciones de una vuelta específica",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la vuelta (lap)",
     *         @OA\Schema(type="integer", example=12)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Datos de telemetría de la vuelta",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="inputs",
     *                 type="array",
     *                 @OA\Items(type="object")
     *             ),
     *             @OA\Property(
     *                 property="positions",
     *                 type="array",
     *                 @OA\Items(type="object")
     *             )
     *         )
     *     )
     * )
     */
    public function get_telemetry($id)
    {

        $inputs = Input::where('lap_id', $id)->get();
        $postions = Position::where('lap_id', $id)->get();

        return response()->json([
            'inputs' => $inputs,
            'positions' => $postions
        ]);

    }

}
