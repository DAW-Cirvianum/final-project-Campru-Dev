<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\ForumController;
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

Route::get('getUserSessions', [AuthController::class, 'getUserRaceSessions'])->middleware('auth:sanctum');

Route::get('checkUserSession/{id}', [SessionsController::class, 'checkUserSession'])->middleware('auth:sanctum');

Route::get('getData/{id}', [SessionsController::class, 'get_data']);

Route::get('getDrivers/{id}', [DriverController::class, 'get_drivers']);

Route::get('getLaps/{id}', [LapsController::class, 'get_laps']);

Route::get('getTelemetry/{id}', [TelemetryController::class, 'get_telemetry']);

// CRUD Sessions
Route::put('editSession/{id}', [SessionsController::class, 'editSession'])->middleware('auth:sanctum');

Route::delete('deleteSession/{id}', [SessionsController::class, 'deleteSession']);

// CRUC Forum and comments

Route::get('getPosts', [ForumController::class, 'getPosts']);

Route::get('getPost/{id}', [ForumController::class, 'getPost']);

Route::get('getComments/{id}', [CommentController::class, 'getComments']);

Route::post('addPost', [ForumController::class, 'addPost'])->middleware('auth:sanctum');

Route::put('editPost/{id}', [ForumController::class, 'editPost'])->middleware('auth:sanctum');

Route::delete('deletePost/{id}', [ForumController::class, 'deletePost'])->middleware('auth:sanctum');

Route::post('addComment/{id}', [CommentController::class, 'addComment'])->middleware('auth:sanctum');

Route::post('replyComment/{id}', [CommentController::class, 'replyComment'])->middleware('auth:sanctum');

Route::put('editComment/{id}', [CommentController::class, 'editComment'])->middleware('auth:sanctum');

Route::delete('deleteComment/{id}', [CommentController::class, 'deleteComment'])->middleware('auth:sanctum');

Route::get('checkUserPost/{id}', [ForumController::class, 'checkUserPost'])->middleware('auth:sanctum');

Route::get('checkUserComment/{id}', [CommentController::class, 'checkUserComment'])->middleware('auth:sanctum');
