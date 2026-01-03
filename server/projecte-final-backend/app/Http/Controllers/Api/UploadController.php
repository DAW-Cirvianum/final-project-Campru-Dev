<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Position;
use App\Models\Race_session;
use App\Models\Lap;
use App\Models\Input;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

// Library for execute Shell commands
use Symfony\Component\Process\Process;

class UploadController extends Controller
{

    public function upload_replay(Request $request)
    {

        $request->validate([
            'file' => 'required|file|max:30240',
            'type' => 'required|string'
        ]);

        $file = $request->file('file');
        $type = $request->string('type');

        if ($file->getClientOriginalExtension() !== 'acreplay') {
            return response()->json(['error' => 'Extensión inválida'], 422);
        }

        // Guardar replay
        $relativePath = $file->storeAs(
            'acreplay',
            'replay.acreplay',
            'private'
        );

        $workDir = storage_path('app/private/acreplay');

        $acreplayPath = $workDir . '/replay.acreplay';
        $acrpBinary = base_path('bin/acrp');
        $pythonBinary = '/usr/bin/python3';
        $pythonScript = base_path('scripts/process.py');

        $acrp = new Process([
            $acrpBinary,
            $acreplayPath,
        ]);

        $acrp->setWorkingDirectory($workDir);
        $acrp->run();

        if (!$acrp->isSuccessful()) {
            return response()->json([
                'error' => 'Error ejecutando acrp',
                'stderr' => $acrp->getErrorOutput(),
            ], 500);
        }

        // DB::beginTransaction();

        // try {

        // Agafar tots el JSON
        $replayDir = storage_path('/app/private/acreplay');
        $files = glob($replayDir . '/replay_*.json');

        $valorNecesario = [];

        foreach ($files as $file) {
            if (count($valorNecesario) > 0) {
                continue;
            }

            $data = json_decode(file_get_contents($file), true);

            if (isset($data['trackName'])) {
                $valorNecesario[] = $data['trackName'];
            }
        }

        $userID = Auth::user()->id;

        $session = Race_session::create([
            'user_id' => $userID,
            'type' => $type,
            'track' => $valorNecesario[0],
        ]);

        $pythonScript = base_path('scripts/analizador_de_telemetria_json_assetto_corsa.py');
        $pythonBinary = base_path('scripts/venv/bin/python');

        $user = User::find($userID);

        $token = $user->createToken('python-token')->plainTextToken;

        $output = "";

        foreach ($files as $file) {

            // Carrgar process fitxer Python
            $python = new Process([
                $pythonBinary,
                $pythonScript,
                $file,
                $token,
                $session->id
            ]);

            // Executar fitxer Python
            $python->setWorkingDirectory($workDir);
            $python->run();

            $output = $python->getOutput();

            // Revisar si ha sortit tot be
            if (!$python->isSuccessful()) {
                throw new \Exception("Error ejecutando Python en $file: " . $python->getErrorOutput());
            }

        }

        // DB::commit();

        // } catch (\Exception $e) {
        //     DB::rollBack();

        //     return response()->json([
        //         'error' => 'Error',
        //         'mensaje' => $e->getMessage()
        //     ], 500);
        // }

        foreach ($files as $file) {
            File::delete($file);
            
        }

        if (File::exists($acreplayPath)) {
            File::delete($acreplayPath);
            echo 'File deleted successfully.';
        } else {
            echo 'File does not exist.';
        }

        return response()->json([
            'message' => 'Proceso completo',
            'valor' => $valorNecesario,
            'python_output' => $output,
        ]);

    }

    public function store(Request $request)
    {
        // Make a validation process to validate to essencial data
        // (This data came from a JSON and can't be another format)
        // We don't validate inputs and positions because there a lot of data and saturates the proccess making stop for cooldown
        $validator = Validator::make($request->all(), [
            'race_session_id' => 'required|integer',
            'pilot' => 'required|string',
            'car' => 'required|string',

            'laps' => 'required|array',
            'laps.*.lap_number' => 'required|integer',
            'laps.*.lap_time' => 'required|numeric',
            'laps.*.max_speed' => 'required|numeric',
            'laps.*.avg_speed' => 'required|numeric',
            'laps.*.max_rpm' => 'required|numeric',

            'laps.*.points' => 'required|array',
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

        // Creating Driver
        $driver = Driver::create([
            'race_session_id' => $data['race_session_id'],
            'driverName' => $data['pilot'],
            'carName' => $data['car']
        ]);

        // Looping lapsData to create laps
        foreach ($data['laps'] as $lapData) {

            // Creating Laps
            $lap = Lap::create([
                'driver_id' => $driver->id,
                'lap_number' => $lapData['lap_number'],
                'lap_time' => $lapData['lap_time'],
                'max_speed' => $lapData['max_speed'],
                'avg_speed' => $lapData['avg_speed'],
                'max_rpm' => $lapData['max_rpm']               
            ]);

            //Making array for do the work more quickly
            $inputs = [];
            $positions = [];

            // Looping data from lap for getting race telemetry data
            foreach ($lapData['points'] as $p) {

                // Adding input data to array inputs
                $inputs[] = [
                    'lap_id' => $lap->id,
                    'd' => $p['d'],
                    'speed' => $p['speed'],
                    'throttle' => $p['throttle'],
                    'brake' => $p['brake'],
                    'gear' => $p['gear'],
                ];

                // Adding positions data to array position
                $positions[] = [
                    'lap_id' => $lap->id,
                    'x' => $p['x'],
                    'y' => $p['y'],
                    'z' => $p['z'],
                ];
            }

            // Insert Inputs and Positions
            Input::insert($inputs);
            Position::insert($positions);
        }

        // return successful
        return response()->json([
            'message' => 'Data added succesfully',
        ]);

    }


}
