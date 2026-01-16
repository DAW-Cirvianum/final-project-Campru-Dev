<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;

class ForumController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/forums",
     *     tags={"Forum"},
     *     summary="Obtener todos los posts del foro",
     *     description="Devuelve todos los posts del foro incluyendo el username del autor",
     *     @OA\Response(
     *         response=200,
     *         description="Listado de posts",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="object")
     *         )
     *     )
     * )
     */

    public function getPosts()
    {

        $posts = Forum::all()->map(function ($post) {
            $username = User::find($post['user_id']);

            $post->username = $username->username;
            return $post;
        });

        return $posts;

    }
    /**
     * @OA\Get(
     *     path="/api/forums/{id}",
     *     tags={"Forum"},
     *     summary="Obtener un post del foro",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del post",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post encontrado",
     *         @OA\JsonContent(
     *             type="object")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post no encontrado"
     *     )
     * )
     */

    public function getPost($id)
    {

        $post = Forum::where('id', $id)->first();

        return $post;

    }
    /**
     * @OA\Post(
     *     path="/api/forums",
     *     tags={"Forum"},
     *     summary="Crear un nuevo post en el foro",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","content"},
     *             @OA\Property(property="title", type="string", maxLength=100, example="Título del post"),
     *             @OA\Property(property="content", type="string", maxLength=255, example="Contenido del post")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post creado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Post created successfully")
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

    public function addPost(Request $request)
    {

        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:100'],
            'content' => ['required', 'string', 'max:255']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        Forum::create([
            "user_id" => $user->id,
            "title" => $data['title'],
            "content" => $data['content']
        ]);

        return response()->json([
            "message" => "Post created successfully"
        ], 200);

    }
    /**
     * @OA\Put(
     *     path="/api/forums/{id}",
     *     tags={"Forum"},
     *     summary="Editar un post",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del post",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Nuevo título"),
     *             @OA\Property(property="content", type="string", example="Nuevo contenido")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post actualizado correctamente"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */

    public function editPost(Request $request, $id)
    {

        echo $request->input('title');
        echo $request->input('content');

        $post = Forum::find($id);
        $post->title = $request->input('title');
        $post->content = $request->input('content');

        $post->save();

        return "Post updated successfully";

    }
    /**
     * @OA\Delete(
     *     path="/api/forums/{id}",
     *     tags={"Forum"},
     *     summary="Eliminar un post",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del post",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post eliminado correctamente"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autenticado"
     *     )
     * )
     */

    public function deletePost($id)
    {

        $post = Forum::find($id);

        if ($post) {
            $post->delete();
        }

        return "Post deleted successfully";

    }
    /**
     * @OA\Get(
     *     path="/api/forums/{id}/check-user",
     *     tags={"Forum"},
     *     summary="Comprobar si el usuario puede modificar/eliminar un post",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del post",
     *         @OA\Schema(type="integer", example=1)
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

    public function checkUserPost($id, Request $request)
    {

        $user = $request->user();

        $post = Forum::find($id);

        if ($post['user_id'] == $user->id || $user->role == "admin") {
            return true;
        } else {
            return false;
        }

    }

}
