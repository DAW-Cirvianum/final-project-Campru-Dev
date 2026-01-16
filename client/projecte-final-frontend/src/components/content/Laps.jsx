import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdditionalData from "../tools/AdditionalData";
import FormatLapTime from "../tools/FormatLapTime";
import EditAndDeleteButtons from "../crud/race_sessions/EditAndDeleteButtons";
import { useTranslation } from "react-i18next";

export default function Laps() {
  const { id } = useParams();
  const [drivers, setDrivers] = useState([]);
  const [lapsData, setLapsData] = useState({});
  const navigate = useNavigate();
  const [userSession, setUserSession] = useState(false);
  let buttons = null;
  const { t } = useTranslation();

  const API_URL = "http://localhost/api";

  useEffect(() => {
    async function getDrivers() {
      try {
        const response = await fetch(`${API_URL}/getDrivers/${id}`);
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        alert(error);
      }
    }

    async function checkUser() {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/checkUserSession/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setUserSession(data);
    }

    getDrivers();
    checkUser();
  }, [id]);

  const [dragInfo, setDragInfo] = useState({
    driverId: null,
    index: null,
  });

  const handleDragStart = (driverId, index) => {
    setDragInfo({ driverId, index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (driverId, dropIndex) => {
    // seguridad
    if (dragInfo.driverId !== driverId) return;

    const driverLaps = [...lapsData[driverId]];
    const draggedLap = driverLaps[dragInfo.index];

    driverLaps.splice(dragInfo.index, 1);
    driverLaps.splice(dropIndex, 0, draggedLap);

    setLapsData((prev) => ({
      ...prev,
      [driverId]: driverLaps,
    }));

    setDragInfo({ driverId: null, index: null });
  };

  if (userSession == 1) {
    buttons = <EditAndDeleteButtons id={id} />;
  }

  const fetchLaps = async (driverId) => {
    if (!lapsData[driverId]) {
      try {
        const res = await fetch(`${API_URL}/getLaps/${driverId}`);
        const data = await res.json();
        setLapsData((prev) => ({ ...prev, [driverId]: data }));
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <>
      <AdditionalData id={id} />

      {buttons}

      <div className="accordion bg-light rounded-4 shadow-sm mt-4" id="accordion" role="region" aria-label={t("drivers.accordionRegion")}>
        {drivers.map((m, i) => {
          const collapseId = `collapse-${i}`;
          const headingId = `heading-${i}`;
          const laps = lapsData[m.id] || [];
          const fastest = laps.length ? Math.min(...laps.map((l) => l.lap_time)) : null;

          return (
            <div className="card border-0 rounded-0" key={m.id}>
              {/* Header */}
              <div
                className="card-header bg-dark text-white px-4 py-3 border-bottom border-secondary"
                id={headingId}
              >
                <h5 className="mb-0">
                  <button
                    className="btn btn-link text-white text-decoration-none fw-semibold fs-6"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded="false"
                    aria-controls={collapseId}
                    onClick={() => fetchLaps(m.id)}
                    aria-label={t("drivers.expandDriverButton", { driver: m.driverName })}
                  >
                    {m.driverName}
                  </button>
                </h5>
              </div>

              {/* Body */}
              <div
                id={collapseId}
                className="collapse"
                aria-labelledby={headingId}
                data-bs-parent="#accordion"
              >
                <div className="card-body bg-body-tertiary px-4 py-4 border-bottom">
                  {laps.map((lap, index) => (
                    <div
                      key={lap.id}
                      draggable
                      onDragStart={() => handleDragStart(m.id, index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(m.id, index)}
                      className={`d-flex justify-content-between align-items-center py-3 px-3 mb-2 rounded-3 ${
                        lap.lap_time === fastest ? "bg-success text-white" : "bg-white"
                      }`}
                      aria-label={t("drivers.lapItem", { number: lap.lap_number, time: lap.lap_time })}
                    >
                      <span>{t("drivers.lapNumber", { number: lap.lap_number })}</span>

                      <span>
                        ⏱️ <FormatLapTime ms={lap.lap_time} />
                      </span>

                      <button
                        className={`btn btn-sm ${lap.lap_time === fastest ? "btn-light" : "btn-outline-primary"}`}
                        onClick={() => navigate("/telemetry/" + lap.id)}
                        aria-label={t("drivers.telemetryButton", { lap: lap.lap_number })}
                      >
                        {t("drivers.telemetryButtonText")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
