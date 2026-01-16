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
    /**
     * @OA\Post(
     *     path="/api/register",
     *     tags={"Auth"},
     *     summary="Registrar un nuevo usuario",
     *     description="Crea un nuevo usuario y envía email de verificación",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"username","email","password","password_confirmation","role"},
     *             @OA\Property(property="username", type="string", minLength=3, maxLength=25, example="johndoe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", minLength=6, maxLength=25, example="secret123"),
     *             @OA\Property(property="password_confirmation", type="string", example="secret123"),
     *             @OA\Property(property="role", type="string", example="user")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Usuario creado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User created"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación"
     *     )
     * )
     */

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'username' => ['required', 'string', 'min:3', 'max:25'],
            'email' => ['required', 'string', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'max:25', 'confirmed'],
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

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'User created',
            'user' => $user
        ], 201);
    }
    /**
     * @OA\Post(
     *     path="/api/login",
     *     tags={"Auth"},
     *     summary="Login de usuario",
     *     description="Permite iniciar sesión usando email o username",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"login","password"},
     *             @OA\Property(property="login", type="string", example="john@example.com"),
     *             @OA\Property(property="password", type="string", example="secret123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login correcto",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="boolean", example=true),
     *             @OA\Property(property="token", type="string", example="1|xxxxxxxxxxxxxxxx"),
     *             @OA\Property(property="role", type="string", example="admin")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Email no verificado"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Credenciales inválidas"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación"
     *     )
     * )
     */

    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'login' => ['required', 'string', 'min:3', 'max:25'],
            'password' => ['required', 'string', 'min:6', 'max:25']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        if (filter_var($request->login, FILTER_VALIDATE_EMAIL)) {
            $loginWith = 'email';
        } else {
            $loginWith = 'username';
        }

        $user = User::where($loginWith, $request->login)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials',
                'user' => $user
            ], 401);
        }

        if ($user->role == "admin") {
            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'status' => true,
                'role' => 'admin',
                'message' => 'Login correcte',
                'token' => $token
            ], 200);
        }

        if (!$user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
            return response()->json([
                'message' => 'Email not verified. Please check your inbox.'
            ], 400);
        }

        $token = $user->createToken('api-token')->plainTextToken;
        Auth::login($user);

        return response()->json([
            'status' => true,
            'token' => $token,
            'user' => $user
        ]);

    }

    /**
     * @OA\Get(
     *     path="/api/profile",
     *     tags={"User"},
     *     summary="Obtener perfil del usuario autenticado",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Datos del usuario",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */

    public function profile(Request $request)
    {

        $user = $request->user();

        return response()->json([
            $user
        ]);

    }
    /**
     * @OA\Get(
     *     path="/api/user/race-sessions",
     *     tags={"Race Sessions"},
     *     summary="Obtener sesiones de carrera del usuario",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Listado de sesiones de carrera",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */

    public function getUserRaceSessions(Request $request)
    {
        $user = $request->user();

        $race_sessions = Race_session::where('user_id', $user->id)->get();

        return response()->json([
            $race_sessions
        ]);
    }

}
