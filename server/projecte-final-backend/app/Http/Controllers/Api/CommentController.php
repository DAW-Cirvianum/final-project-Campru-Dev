<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Validator;

class CommentController extends Controller
{
    public function getComments($id) {

        $comments = Comment::where('forum_id', $id)->get();

        return $comments;

    }

    public function addComment(Request $request, $id) {

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

    public function replyComment(Request $request, $id) {

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

    public function editComment(Request $request ,$id) {

        $comment = Comment::find($id);
        $comment->content = $request->input('content');

        $comment->save();

        return "Comment edited successfully";

    }

    public function deleteComment($id) {

        $comment = Comment::find($id);

        if ($comment) {
            $comment->delete();
        }

        return "comment deleted successfully";

    }

    public function checkUserComment($id, Request $request) {

        $user = $request->user();

        $comment = Comment::find( $id);

        if ($comment['user_id'] == $user->id || $user->role == "admin") {
            return true;
        } else {
            return false;
        }

    }
}
