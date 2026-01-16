import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function Resetpassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_repeated, setRepeated] = useState("");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const API_URL = "http://localhost/api";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userObj = {
      token: token,
      email: email,
      password: password,
      password_confirmation: password_repeated,
    };

    console.log(userObj);

    const response = await fetch(`${API_URL}/reset_password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userObj),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        const allErrors = Object.values(data.errors).flat();

        allErrors.forEach((msg) => {
          enqueueSnackbar(msg, { variant: "error" });
        });
        return;
      } else {
        enqueueSnackbar(data.message, {
          variant: "error",
        });
        return;
      }
    } else {
      enqueueSnackbar("Password reseted successfully", { variant: "success" });
      navigate("/login");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-5 rounded-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">
          Reset Password 🔑
        </h3>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
            name="email"
            title="Add email in this field"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            name="password"
            required
            title="Add password in this field, must be between 6 and 25 characters"
          />
          <label htmlFor="reapeted_password">Repeated Password</label>
          <input
            type="password"
            placeholder="Repeat New Password"
            value={password_repeated}
            onChange={(e) => setRepeated(e.target.value)}
            className="form-control"
            name="reapeted_password"
            required
            title="Add the same password added in this field"
          />

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
