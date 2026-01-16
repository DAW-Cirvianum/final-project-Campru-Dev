<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Hash;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Str;

class RecoveryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/email/verify/{id}/{hash}",
     *     tags={"Auth"},
     *     summary="Verificar email del usuario",
     *     description="Valida el hash del email y marca el email como verificado",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del usuario",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="hash",
     *         in="path",
     *         required=true,
     *         description="Hash de verificación",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Email verificado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Email verified successfully."),
     *             @OA\Property(property="token", type="string", example="1|xxxxxxxxxxxxxxxxxxxx"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Link de verificación inválido"
     *     )
     * )
     */
    public function verifyEmail(Request $request)
    {

        $id = $request->route('id');
        $hash = $request->route('hash');
        $user = User::findOrFail($id);

        $userHash = sha1($user->getEmailForVerification());
        if (!hash_equals($hash, $userHash)) {
            return response()->json([
                'message' => 'Invalid verification link'
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified.'
            ]);
        }

        $user->markEmailAsVerified();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Email verified successfully.',
            'token' => $token,
            'user' => $user
        ]);

    }
    /**
     * @OA\Post(
     *     path="/api/email/resend",
     *     tags={"Auth"},
     *     summary="Reenviar email de verificación",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Email de verificación reenviado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Email verification resended")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Email ya verificado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Email alredy verified")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */

    public function resendVerification(Request $request)
    {

        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email alredy verified'
            ], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Email verification resended'
        ]);

    }
    /**
     * @OA\Post(
     *     path="/api/password/forgot",
     *     tags={"Auth"},
     *     summary="Solicitar enlace de reseteo de contraseña",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Enlace de reseteo enviado (si existe el email)",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="If the email exists in DB, a password reset link has been sent")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="boolean", example=false),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */

    public function forgotPassword(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return response()->json([
            'message' => 'If the email exists in DB, a password reset link has been sent'
        ], 200);

    }
    /**
     * @OA\Post(
     *     path="/api/password/reset",
     *     tags={"Auth"},
     *     summary="Resetear contraseña",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"token","email","password","password_confirmation"},
     *             @OA\Property(property="token", type="string", example="reset-token"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", example="newpassword123"),
     *             @OA\Property(property="password_confirmation", type="string", example="newpassword123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contraseña actualizada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Password updated successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="boolean", example=false),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Error al actualizar contraseña",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error updating password")
     *         )
     *     )
     * )
     */

    public function resetPassword(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:6', 'confirmed']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60)
                ])->save();

                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'status' => true,
                'message' => 'Password updated successfully'
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Error updating password'
        ]);

    }


}
