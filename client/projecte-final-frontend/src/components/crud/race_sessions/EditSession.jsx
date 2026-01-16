import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EditSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [userSession, setUserSession] = useState(false);
  const [type, setType] = useState("");

  const API_URL = "http://localhost/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function checkUser() {
      const response = await fetch(`${API_URL}/checkUserSession/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setUserSession(data);
    }
    checkUser();
  }, [id]);

  if (userSession == 0) {
    navigate("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/editSession/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: type,
        }),
      });

      if (response.ok) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center" role="main">
      <div
        className="card shadow-sm border-0 p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="fw-bold text-center mb-4">{t("editSession.title")}</h1>

        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column gap-3"
          aria-label={t("editSession.formAriaLabel")}
        >
          <div>
            <label htmlFor="sessionType" className="form-label small text-secondary">
              {t("editSession.typeLabel")}
            </label>
            <select
              id="sessionType"
              className="form-select"
              onChange={(e) => setType(e.target.value)}
              required
              aria-required="true"
              aria-label={t("editSession.typeAriaLabel")}
            >
              <option value="race">{t("editSession.typeRace")}</option>
              <option value="practice">{t("editSession.typePractice")}</option>
              <option value="qualifying">{t("editSession.typeQualifying")}</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            aria-label={t("editSession.submitButtonAria")}
          >
            {t("editSession.submitButtonText")}
          </button>
        </form>
      </div>
    </div>
  );
}
