<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar usuario</title>
</head>
<body>

    <h1>Editar usuario</h1>

    <form method="POST" action="{{ route('admin.users.update', $user->id) }}">
        @csrf
        @method('PUT')

        <div>
            <label>Username</label><br>
            <input type="text" name="username" value="{{ $user->username }}">
        </div>

        <br>

        <div>
            <label>Email</label><br>
            <input type="email" name="email" value="{{ $user->email }}">
        </div>

        <br>

        <div>
            <label>Rol</label><br>
            <select name="role">
                <option value="admin" @selected($user->role === 'admin')>Admin</option>
                <option value="user" @selected($user->role === 'user')>User</option>
            </select>
        </div>

        <br>

        <button type="submit">Guardar cambios</button>
    </form>

    <br>

    <a href="/user-list">Back</a>

</body>
</html>
