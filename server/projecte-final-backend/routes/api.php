<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\LapsController;
use App\Http\Controllers\Api\SessionsController;
use App\Http\Controllers\Api\TelemetryController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('register', [AuthController::class, 'store'])
->name('register.user');

Route::post('login', [AuthController::class, 'login']);

Route::get('profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');

Route::post('upload', [UploadController::class, 'upload_replay'])->middleware('auth:sanctum');

Route::post('store', [UploadController::class, 'store'])->middleware('auth:sanctum');

Route::get('getSessions', [SessionsController::class, 'get_sessions']);

Route::get('getData/{id}', [SessionsController::class, 'get_data']);

Route::get('getDrivers/{id}', [DriverController::class, 'get_drivers']);

Route::get('getLaps/{id}', [LapsController::class, 'get_laps']);

Route::get('getTelemetry/{id}', [TelemetryController::class, 'get_telemetry']);