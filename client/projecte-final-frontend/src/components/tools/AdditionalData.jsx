import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormatLapTime from "./FormatLapTime";
import { useTranslation } from "react-i18next";

export default function AdditionalData({ id }) {
  const [maxSpeed, setMaxSpeed] = useState();
  const [avgSpeed, setAvgSpeed] = useState();
  const [maxRPM, setMaxRPM] = useState();
  const [numDrivers, setNumDrivers] = useState();
  const [fastLap, setFastLap] = useState();
  const [uploadedby, setUploadedby] = useState();
  const [type, setType] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const API_URL = "http://localhost/api";
  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch(`${API_URL}/getData/${id}`);
        const data = await response.json();

        setMaxSpeed(data["max_speed"]);
        setAvgSpeed(data["avg_speed"]);
        setMaxRPM(data["max_rpm"]);
        setNumDrivers(data["numberOfDrivers"]);
        setFastLap(data["fast_lap"]);
        setUploadedby(data["uploaded_by"]);
        setType(data["type"]);
        setDate(data["date"]);
        setTime(data["time"]);
      } catch (error) {
        alert(error);
      }
    }

    getData();
  }, [id]);

  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* Block 1: Performance */}
        <section className="col-md-4" aria-label={t("sessionSummary.performanceBlock")}>
          <div className="bg-dark text-white p-4 rounded shadow-sm h-100">
            <h2 className="text-uppercase text-secondary mb-3">{t("sessionSummary.performance")}</h2>
            <p>
              🚀 {t("sessionSummary.maxSpeed")}: <strong>{maxSpeed}</strong>
            </p>
            <p>
              📊 {t("sessionSummary.avgSpeed")}: <strong>{avgSpeed}</strong>
            </p>
            <p>
              ⚙️ {t("sessionSummary.maxRPM")}: <strong>{maxRPM}</strong>
            </p>
          </div>
        </section>

        {/* Block 2: Session */}
        <section className="col-md-4" aria-label={t("sessionSummary.sessionBlock")}>
          <div className="bg-dark text-white p-4 rounded shadow-sm h-100">
            <h2 className="text-uppercase text-secondary mb-3">{t("sessionSummary.session")}</h2>
            <p>
              👥 {t("sessionSummary.drivers")}: <strong>{numDrivers}</strong>
            </p>
            <p>
              🏁 {t("sessionSummary.fastLap")}:{" "}
              <strong>
                <FormatLapTime ms={fastLap} />
              </strong>
            </p>
          </div>
        </section>

        {/* Block 3: Details */}
        <section className="col-md-4" aria-label={t("sessionSummary.detailsBlock")}>
          <div className="bg-dark text-white p-4 rounded shadow-sm h-100">
            <h2 className="text-uppercase text-secondary mb-3">{t("sessionSummary.details")}</h2>
            <p>
              ⬆️ {t("sessionSummary.uploadedBy")}: <strong>{uploadedby}</strong>
            </p>
            <p>
              🏷️ {t("sessionSummary.type")}: <strong>{type}</strong>
            </p>
            <p>
              📅 {t("sessionSummary.date")}: <strong>{date}</strong>
            </p>
            <p>
              ⏰ {t("sessionSummary.time")}: <strong>{time}</strong>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
