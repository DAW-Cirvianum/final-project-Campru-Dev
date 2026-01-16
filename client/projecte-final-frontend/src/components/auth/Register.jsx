// src/components/Register.jsx
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_URL = "http://localhost/api";

export default function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_repeated, setRepeated] = useState("");
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userObj = {
        username: username,
        email: email,
        password: password,
        password_confirmation: password_repeated,
        role: "user",
      };

      console.log(userObj);

      const response = await fetch(`${API_URL}/register`, {
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
      }

      enqueueSnackbar("User registered successfully", { variant: "success" });
      navigate("/login");

    } catch (err) {
      alert(err);
      alert("Error d'autenticació");
    }
  };

 return (
    <div className="container d-flex justify-content-center align-items-center vh-100" role="main">
      <div
        className="card shadow-lg p-5 rounded-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="text-center mb-4 text-primary fw-bold">
          {t("register.title")} 🏁
        </h1>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3" aria-label={t("register.formAriaLabel")}>
          <div>
            <label htmlFor="username" className="form-label">{t("register.username")}</label>
            <input
              id="username"
              type="text"
              placeholder={t("register.usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              required
              aria-required="true"
              aria-label={t("register.usernameAriaLabel")}
              title={t("register.usernameTitle")}
            />
          </div>

          <div>
            <label htmlFor="email" className="form-label">{t("register.email")}</label>
            <input
              id="email"
              type="email"
              placeholder={t("register.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
              aria-required="true"
              aria-label={t("register.emailAriaLabel")}
              title={t("register.emailTitle")}
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">{t("register.password")}</label>
            <input
              id="password"
              type="password"
              placeholder={t("register.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
              aria-required="true"
              aria-label={t("register.passwordAriaLabel")}
              title={t("register.passwordTitle")}
            />
          </div>

          <div>
            <label htmlFor="password_repeated" className="form-label">{t("register.repeatPassword")}</label>
            <input
              id="password_repeated"
              type="password"
              placeholder={t("register.repeatPasswordPlaceholder")}
              value={password_repeated}
              onChange={(e) => setRepeated(e.target.value)}
              className="form-control"
              required
              aria-required="true"
              aria-label={t("register.repeatPasswordAriaLabel")}
              title={t("register.repeatPasswordTitle")}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            aria-label={t("register.registerButton")}
          >
            {t("register.registerButton")}
          </button>
        </form>

        <div className="text-center mt-3 small">
          {t("register.haveAccount")}{" "}
          <a href="/login" className="text-decoration-none">
            {t("register.loginLink")}
          </a>
        </div>
      </div>
    </div>
  );
}
