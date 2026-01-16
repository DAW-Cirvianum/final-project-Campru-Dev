import { useContext, useState } from "react";
import Dashboard from "../content/Dashboard";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

const API_URL = "http://localhost/api";

export default function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // CRUCIAL: Això permet gestionar la sessió (cookies) entre ports
        credentials: "include", //Això es important per guardar les cookies de ssesio
        body: JSON.stringify({
          login: mail,
          password: password,
        }),
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
      }

      if (data.status) {
        if (data.role === "admin") {
          // Si és admin, fem el salt a la part de Blade de Laravel
          window.location.href =
            "http://localhost/admin/login-bridge?token=" + data.token;
          return;
        } else {
          // Si és usuari normal, guardem el token per a l'API
          const userData = {
            username: data.user.username,
            id: data.user.id,
            role: data.user.role,
            token: data.token,
          };

          login(userData.username, userData.token, userData.id, userData.role);

          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", data.token);

          enqueueSnackbar("Login successfull", { variant: "success" });
          navigate("/dashboard");
        }
      } else {
        console.log("Error: " + data.errors);
      }
    } catch (error) {
      console.error("Error en la petició:", error);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
      role="main"
    >
      <div
        className="card shadow-lg p-5 rounded-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="text-center mb-4 text-primary fw-bold">
          {t("login.title")} 🏁
        </h1>

        <form onSubmit={handleLogin} aria-label={t("login.formAriaLabel")}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {t("login.email")}
            </label>
            <input
              id="email"
              type="text"
              name="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder={t("login.emailPlaceholder")}
              className="form-control"
              required
              aria-required="true"
              aria-label={t("login.emailAriaLabel")}
              title={t("login.emailTitle")}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              {t("login.password")}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
              aria-required="true"
              aria-label={t("login.passwordAriaLabel")}
              title={t("login.passwordTitle")}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            aria-label={t("login.loginButton")}
          >
            {t("login.loginButton")}
          </button>
        </form>

        <div className="text-center small">
          {t("login.noAccount")}{" "}
          <a href="/register" className="text-decoration-none">
            {t("login.register")}
          </a>
          <br />
          <a href="/forgot_password" className="text-decoration-none">
            {t("login.forgotPassword")}
          </a>
        </div>
      </div>
    </div>
  );
}
