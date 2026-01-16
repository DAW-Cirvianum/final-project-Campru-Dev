import { useEffect, useState } from "react";
import Race_sessions from "./Race_sessions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container my-5" role="main">
      <h1 className="text-center mb-4 text-primary fw-bold">
        {t("dashboard.title")} 🏎️
      </h1>

      <div
        className="d-flex justify-content-center gap-3 mb-5 flex-wrap"
        role="region"
        aria-label={t("dashboard.actionsRegion")}
      >
        <button
          className="btn btn-outline-primary btn-lg"
          onClick={() => navigate("/user_race_sessions")}
          aria-label={t("dashboard.userSessionsButton")}
        >
          {t("dashboard.userSessionsButton")}
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/add_new_session")}
          aria-label={t("dashboard.uploadSessionButton")}
        >
          {t("dashboard.uploadSessionButton")}
        </button>
      </div>

      <div aria-label={t("dashboard.raceSessionsSection")}>
        <Race_sessions />
      </div>
    </div>
  );
}
