import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AddSession() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("race");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const API_URL = "http://localhost/api";

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Selecciona un archivo");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const token = localStorage.getItem("token");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.text();
      console.log(data);

      if (response.ok) {
        enqueueSnackbar("File uploaded successfully", { variant: "success" });
        navigate("/dashboard");
      } else {
        setError(data.error);
        enqueueSnackbar("Error uploading file", { variant: "error" });
        enqueueSnackbar("Add file with acreplay extension", {
          variant: "info",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center" role="main">
      <div
        className="card shadow-sm border-0 p-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <h1 className="fw-bold text-center mb-4">{t("uploadSession.title")}</h1>

        <form
          onSubmit={handleUpload}
          className="d-flex flex-column gap-3"
          aria-label={t("uploadSession.formAriaLabel")}
        >
          {/* Type */}
          <div>
            <label
              htmlFor="sessionType"
              className="form-label small text-secondary"
            >
              {t("uploadSession.typeLabel")}
            </label>
            <select
              id="sessionType"
              className="form-select"
              onChange={(e) => setType(e.target.value)}
              required
              aria-required="true"
              aria-label={t("uploadSession.typeAriaLabel")}
            >
              <option value="race">{t("uploadSession.typeRace")}</option>
              <option value="practice">
                {t("uploadSession.typePractice")}
              </option>
              <option value="qualifying">
                {t("uploadSession.typeQualifying")}
              </option>
            </select>
          </div>

          {/* File */}
          <div>
            <label
              htmlFor="replayFile"
              className="form-label small text-secondary"
            >
              {t("uploadSession.fileLabel")}
            </label>
            <input
              id="replayFile"
              type="file"
              className="form-control"
              name="file"
              accept=".acreplay"
              onChange={(e) => setFile(e.target.files[0])}
              required
              aria-required="true"
              aria-label={t("uploadSession.fileAriaLabel")}
            />
            {error && (
              <small className="small text-danger text-end" role="alert">
                <b>
                  <i>{error}</i>
                </b>
              </small>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            aria-label={t("uploadSession.submitButtonAria")}
          >
            {t("uploadSession.submitButtonText")}
          </button>

          {/* Loading */}
          {loading && (
            <div
              className="d-flex justify-content-center align-items-center gap-2 mt-3"
              aria-live="polite"
            >
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  {t("uploadSession.loadingText")}
                </span>
              </div>
              <span className="small text-secondary">
                {t("uploadSession.loadingText")}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
