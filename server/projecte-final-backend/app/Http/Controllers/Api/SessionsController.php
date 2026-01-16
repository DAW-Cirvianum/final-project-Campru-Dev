<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Lap;
use App\Models\Race_session;
use App\Models\User;
use Illuminate\Http\Request;

class SessionsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/race-sessions",
     *     tags={"Race Sessions"},
     *     summary="Obtener todas las sesiones de carrera",
     *     description="Devuelve todas las sesiones de carrera registradas",
     *     @OA\Response(
     *         response=200,
     *         description="Listado de sesiones de carrera",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="object")
     *         )
     *     )
     * )
     */

    public function get_sessions()
    {
        // returning all race_sessions
        return response()->json(Race_session::all());

    }

    /**
     * @OA\Get(
     *     path="/api/race-sessions/search",
     *     tags={"Race Sessions"},
     *     summary="Buscar sesiones de carrera",
     *     description="Filtra sesiones de carrera por track (opcional)",
     *     @OA\Parameter(
     *         name="track",
     *         in="query",
     *         required=false,
     *         description="Nombre parcial del track",
     *         @OA\Schema(type="string", example="Silverstone")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Listado filtrado de sesiones de carrera",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="object")
     *         )
     *     )
     * )
     */

    public function get_sessionBySearch(Request $request)
    {
        // Crear query base
        $query = Race_session::query();

        // Filtrar por track si viene en la request
        if ($request->has('track')) {
            $query->where('track', 'LIKE', '%' . $request->track . '%');
        }

        // Ejecutar query y retornar JSON
        return response()->json($query->get());
    }
    /**
     * @OA\Get(
     *     path="/api/race-sessions/{id}/data",
     *     tags={"Race Sessions"},
     *     summary="Obtener datos de una sesión de carrera",
     *     description="Devuelve estadísticas agregadas de la sesión y los pilotos",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la sesión de carrera",
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Datos de la sesión",
     *         @OA\JsonContent(
     *             @OA\Property(property="max_speed", type="number", format="float", example=320.5),
     *             @OA\Property(property="avg_speed", type="number", format="float", example=250.7),
     *             @OA\Property(property="max_rpm", type="integer", example=12000),
     *             @OA\Property(property="fast_lap", type="number", format="float", example=89.34),
     *             @OA\Property(property="numberOfDrivers", type="integer", example=6),
     *             @OA\Property(property="uploaded_by", type="string", example="johndoe"),
     *             @OA\Property(property="type", type="string", example="Qualifying"),
     *             @OA\Property(property="date", type="string", example="2026-01-16"),
     *             @OA\Property(property="time", type="string", example="14:35:22")
     *         )
     *     )
     * )
     */

    public function get_data($id)
    {
        // Getting the race_session
        $race_session = Race_session::where('id', $id)->get();

        // Getting the User from race_session
        $user = User::where('id', $race_session[0]['user_id'])->get();

        // Getting the drivers from race_session
        $drivers = Driver::where('race_session_id', $id)->get();
        $max_speed = 0;
        $avg_speed = 0;
        $max_rpm = 0;
        // Formatting for then compare
        $fast_lap = PHP_INT_MAX;

        // Counting number of Drivers
        $numberOfDrivers = count($drivers);
        // Getting username from user
        $username = $user[0]['username'];
        // Getting the type of race_session
        $type = $race_session[0]['type'];

        // Getting and separating date and time of race_session
        $datetime = $race_session[0]['created_at'];
        list($date, $time) = explode(' ', $datetime);

        // Looping drivers data
        foreach ($drivers as $driver) {

            // Getting data from each driver
            $driver_max_speed = Lap::where('driver_id', $driver->id)->max('max_speed');
            $driver_avg_speed = Lap::where('driver_id', $driver->id)->avg('avg_speed');
            $driver_max_rpm = Lap::where('driver_id', $driver->id)->max('max_rpm');
            $driver_fast_lap = Lap::where('driver_id', $driver->id)->min('lap_time');

            // Comparing driver data with others drivers
            if ($driver_max_speed > $max_speed) {
                $max_speed = $driver_max_speed;
            }

            if ($driver_max_rpm > $max_rpm) {
                $max_rpm = $driver_max_rpm;
            }

            if ($driver_fast_lap < $fast_lap) {
                $fast_lap = $driver_fast_lap;
            }

            // Getting the total of average speed
            $avg_speed += $driver_avg_speed;
        }

        // Making the average
        $avg_speed = $drivers->count() ? $avg_speed / $drivers->count() : 0;

        // returning all the data
        return response()->json([
            "max_speed" => $max_speed,
            "avg_speed" => $avg_speed,
            "max_rpm" => $max_rpm,
            "fast_lap" => $fast_lap,
            "numberOfDrivers" => $numberOfDrivers,
            "uploaded_by" => $username,
            "type" => $type,
            "date" => $date,
            "time" => $time
        ]);

    }
    /**
     * @OA\Get(
     *     path="/api/race-sessions/{id}/check-user",
     *     tags={"Race Sessions"},
     *     summary="Comprobar si el usuario puede modificar/eliminar la sesión",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la sesión de carrera",
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Resultado de la comprobación",
     *         @OA\JsonContent(
     *             type="boolean",
     *             example=true
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */

    public function checkUserSession($id, Request $request)
    {
        $user = $request->user();

        $race_sessions = Race_session::where('id', $id)->get();

        if ($race_sessions[0]['user_id'] == $user->id || $user->role == "admin") {
            return true;
        } else {
            return false;
        }
    }
    /**
     * @OA\Put(
     *     path="/api/race-sessions/{id}",
     *     tags={"Race Sessions"},
     *     summary="Editar tipo de sesión de carrera",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la sesión de carrera",
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="type", type="string", example="Race")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Sesión de carrera actualizada correctamente"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */

    public function editSession(Request $request, $id)
    {

        $session = Race_session::find($id);
        $session->type = $request->input('type');

        $session->save();

        return response()->json("Race Session updated succesfully");

    }
    /**
     * @OA\Delete(
     *     path="/api/race-sessions/{id}",
     *     tags={"Race Sessions"},
     *     summary="Eliminar sesión de carrera",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la sesión de carrera",
     *         @OA\Schema(type="integer", example=5)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Sesión de carrera eliminada correctamente"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */

    public function deleteSession($id)
    {

        $raceSession = Race_session::find($id);

        if ($raceSession) {
            $raceSession->delete();
        }

        return response()->json("Race Session deleted succesfully");

    }

}
