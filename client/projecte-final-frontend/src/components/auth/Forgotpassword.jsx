import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export default function Forgotpassword() {
  const [email, setMail] = useState("");
  const API_URL = "http://localhost/api";
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userObj = {
      email: email,
    };

    try {
      const response = await fetch(`${API_URL}/forgot_password`, {
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
        enqueueSnackbar(data.message, {
          variant: "success",
        });
      }

    } catch (error) {
      console.log(error);
    }
  };

 return (
    <div className="container d-flex justify-content-center align-items-center vh-100" role="main">
      <div
        className="card shadow-lg p-5 rounded-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="text-center mb-4 text-primary fw-bold">
          {t("forgotPassword.title")}
        </h1>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3" aria-label={t("forgotPassword.formAriaLabel")}>
          <div>
            <label htmlFor="email" className="form-label">{t("forgotPassword.email")}</label>
            <input
              id="email"
              type="email"
              placeholder={t("forgotPassword.emailPlaceholder")}
              value={email}
              onChange={(e) => setMail(e.target.value)}
              className="form-control"
              required
              aria-required="true"
              aria-label={t("forgotPassword.emailAriaLabel")}
              title={t("forgotPassword.emailTitle")}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            aria-label={t("forgotPassword.sendButton")}
          >
            {t("forgotPassword.sendButton")}
          </button>
        </form>

        <div className="text-center mt-3 small">
          {t("forgotPassword.rememberedPassword")}{" "}
          <a href="/login" className="text-decoration-none">
            {t("forgotPassword.loginLink")}
          </a>
        </div>
      </div>
    </div>
  );
}
