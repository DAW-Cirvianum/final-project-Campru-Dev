import { useContext, useState } from "react";
import Dashboard from "../content/Dashboard";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";

const API_URL = "http://localhost/api";

export default function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userObj = {
      email: mail,
      password: password,
    };

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userObj),
      });

      if (!response.ok) throw new Error("Login error: " + response.status);

      const d = await response.json();

      console.log(d);

      login(d.user.username, d.token, d.user.id);
      localStorage.setItem("token", d.token);
      navigate("/dashboard");

    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-4">Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-decoration-none">
              Regístrate
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}
