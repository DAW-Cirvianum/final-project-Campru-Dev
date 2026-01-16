<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lap;
use Illuminate\Http\Request;

class LapsController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/drivers/{id}/laps",
     *     tags={"Laps"},
     *     summary="Obtener vueltas de un piloto",
     *     description="Devuelve todas las vueltas asociadas a un piloto",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del piloto",
     *         @OA\Schema(type="integer", example=12)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Listado de vueltas",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="object")
     *         )
     *     )
     * )
     */
    public function get_laps($id)
    {

        $laps = Lap::where('driver_id', $id)->get();

        return response()->json($laps);

    }

}
