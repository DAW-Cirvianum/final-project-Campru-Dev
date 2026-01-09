// src/components/Register.jsx
import { useState } from "react";

const API_URL = "http://localhost/api";

export default function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_repeated, setRepeated] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const userObj = {
        "username": username,
        "email": email,
        "password": password,
        "password_confirmation": password_repeated,
        "role": "user"
      };

      console.log(userObj);

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userObj),
      });

      console.log(await response.json());
    } catch (err) {
      alert(err);
      alert("Error d'autenticació");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        className="form-control"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        className="form-control"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Contrasenya"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Repeteix contrasenya"
        className="form-control"
        value={password_repeated}
        onChange={(e) => setRepeated(e.target.value)}
      />
      <br />
      <button type="submit">Entrar</button>
    </form>
  );
}
