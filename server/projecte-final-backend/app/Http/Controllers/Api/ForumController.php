<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;

class ForumController extends Controller
{
    
    public function getPosts() {

        $posts = Forum::all()->map(function ($post) {
            $username = User::find($post['user_id']);

            $post->username = $username->username;
            return $post;
        });

        return $posts;

    }

    public function getPost($id) {

        $post = Forum::where('id', $id)->first();

        return $post;

    }

    public function addPost(Request $request) {

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

    public function editPost(Request $request ,$id) {

        echo $request->input('title');
        echo $request->input('content');

        $post = Forum::find($id);
        $post->title = $request->input('title');
        $post->content = $request->input('content');

        $post->save();

        return "Post updated successfully";

    }

    public function deletePost($id) {

        $post = Forum::find($id);

        if ($post) {
            $post->delete();
        }

        return "Post deleted successfully";

    }

    public function checkUserPost($id, Request $request) {

        $user = $request->user();

        $post = Forum::find( $id);

        if ($post['user_id'] == $user->id) {
            return true;
        } else {
            return false;
        }

    }

}
