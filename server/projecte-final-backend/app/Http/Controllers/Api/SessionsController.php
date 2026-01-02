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
    public function get_sessions()
    {
        // returning all race_sessions
        return response()->json(Race_session::all());

    }

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
}
