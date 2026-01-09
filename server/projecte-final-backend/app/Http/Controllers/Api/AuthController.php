<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Race_session;
use Illuminate\Http\Request;
use Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'role' => ['required', 'string']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role']
        ]);

        //$user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'User created',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string'],
            'password' => ['required', 'string']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        if ($user->role == 'admin') {
            Auth::guard('web')->login($user);
            return view('admin.userList');
        }

        $token = $user->createToken('api-token')->plainTextToken;
        Auth::login($user);

        return response()->json([
            'status' => true,
            'token' => $token,
            'user' => $user
        ]);

    }

    public function profile(Request $request) {

        $user = $request->user();

        return response()->json([
            $user
        ]);

    }

    public function getUserRaceSessions(Request $request) {
        $user = $request->user();

        $race_sessions = Race_session::where('user_id', $user->id)->get();

        return response()->json([
            $race_sessions
        ]);
    }

}
