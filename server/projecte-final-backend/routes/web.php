<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

Route::get('/admin/login-bridge', function (Request $request) {

    $tokenValue = $request->query('token');

    if (!$tokenValue || $tokenValue === 'undefined') {
        abort(400, 'Token inválido');
    }

    $token = PersonalAccessToken::findToken($tokenValue);
    $user = $token?->tokenable;

    if (!$user || $user->role !== 'admin') {
        abort(403);
    }

    Auth::login($user);

    return redirect('/user-list');
});

Route::get('/user-list', function () {
    return view('/admin/userList', [
        'users' => User::all()
    ]);
});

Route::get('/admin/users/{user}/edit', function (User $user) {
    return view('/admin/edit-user', [
        'user' => $user,
    ]);
})->name('admin.users.edit');

Route::put('/admin/users/{user}', function (Request $request, User $user) {

    $request->validate([
        'username' => 'required|string',
        'email' => 'required|email',
        'role' => 'required|in:admin,user',
    ]);

    $user->update([
        'username' => $request->username,
        'email' => $request->email,
        'role' => $request->role,
    ]);

    return redirect('/user-list')->with('success', 'Usuario actualizado');
})->name('admin.users.update');

Route::get('/', function () {
    return view('welcome');
});