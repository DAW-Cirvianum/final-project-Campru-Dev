<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Validator;

class CommentController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/forums/{id}/comments",
     *     tags={"Comments"},
     *     summary="Obtener comentarios de un foro",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del foro",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Listado de comentarios",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="object")
     *         )
     *     )
     * )
     */

    public function getComments($id)
    {

        $comments = Comment::where('forum_id', $id)->get();

        return $comments;

    }
    /**
     * @OA\Post(
     *     path="/api/forums/{id}/comments",
     *     tags={"Comments"},
     *     summary="Añadir comentario a un foro",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del foro",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content"},
     *             @OA\Property(property="content", type="string", maxLength=255, example="Este es un comentario")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Comentario creado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Comment created successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación"
     *     )
     * )
     */

    public function addComment(Request $request, $id)
    {

        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'content' => ['required', 'string', 'max:255']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        Comment::create([
            "forum_id" => $id,
            "user_id" => $user->id,
            "content" => $data['content']
        ]);

        return response()->json([
            "message" => "Comment created successfully"
        ], 200);

    }
    /**
     * @OA\Post(
     *     path="/api/comments/{id}/reply",
     *     tags={"Comments"},
     *     summary="Responder a un comentario",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del comentario a responder",
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content"},
     *             @OA\Property(property="content", type="string", maxLength=255, example="Esta es una respuesta")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Respuesta creada correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Comment created successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación"
     *     )
     * )
     */

    public function replyComment(Request $request, $id)
    {

        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'content' => ['required', 'string', 'max:255']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $forum_id = Comment::find($id);

        echo $forum_id;

        Comment::create([
            "forum_id" => $forum_id->forum_id,
            "user_id" => $user->id,
            "content" => $data['content'],
            "reply_to" => $id
        ]);

        return response()->json([
            "message" => "Comment created successfully"
        ], 200);

    }
    /**
     * @OA\Put(
     *     path="/api/comments/{id}",
     *     tags={"Comments"},
     *     summary="Editar un comentario",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del comentario",
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content"},
     *             @OA\Property(property="content", type="string", example="Contenido editado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Comentario editado correctamente"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */

    public function editComment(Request $request, $id)
    {

        $comment = Comment::find($id);
        $comment->content = $request->input('content');

        $comment->save();

        return "Comment edited successfully";

    }
    /**
     * @OA\Delete(
     *     path="/api/comments/{id}",
     *     tags={"Comments"},
     *     summary="Eliminar un comentario",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del comentario",
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Comentario eliminado correctamente"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */

    public function deleteComment($id)
    {

        $comment = Comment::find($id);

        if ($comment) {
            $comment->delete();
        }

        return "comment deleted successfully";

    }
    /**
     * @OA\Get(
     *     path="/api/comments/{id}/check-user",
     *     tags={"Comments"},
     *     summary="Comprobar si el usuario puede modificar/eliminar un comentario",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del comentario",
     *         @OA\Schema(type="integer", example=10)
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

    public function checkUserComment($id, Request $request)
    {

        $user = $request->user();

        $comment = Comment::find($id);

        if ($comment['user_id'] == $user->id || $user->role == "admin") {
            return true;
        } else {
            return false;
        }

    }
}
