import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdditionalData from "../tools/AdditionalData";
import FormatLapTime from "../tools/FormatLapTime";

export default function Laps() {
  const { id } = useParams();
  const [drivers, setDrivers] = useState([]);
  const [lapsData, setLapsData] = useState({}); // laps por piloto
  const navigate = useNavigate();
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
    getDrivers();
  }, [id]);

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

      <div id="accordion">
        {drivers.map((m, i) => {
          const collapseId = `collapse-${i}`;
          const headingId = `heading-${i}`;

          return (
            <div className="card" key={m.id}>
              <div className="card-header" id={headingId}>
                <h5 className="mb-0">
                  <button
                    className="btn btn-link"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded="false"
                    aria-controls={collapseId}
                    onClick={() => fetchLaps(m.id)}
                  >
                    {m.driverName}
                  </button>
                </h5>
              </div>

              <div
                id={collapseId}
                className="collapse"
                aria-labelledby={headingId}
                data-bs-parent="#accordion"
              >
                <div className="card-body">
                  {(() => {
                    const laps = lapsData[m.id] || [];

                    const fastest = laps.length
                      ? Math.min(...laps.map((l) => l.lap_time))
                      : null;

                    return laps.map((lap) => (
                      <div
                        key={lap.id}
                        className={`d-flex justify-content-around m-3 ${
                          lap.lap_time === fastest
                            ? "bg-success text-white"
                            : ""
                        }`}
                      >
                        <p>Vuelta {lap.lap_number}</p>
                        <p>Time: {<FormatLapTime ms={lap.lap_time} />}</p>

                        <button
                          onClick={() => navigate("/telemetry/" + lap.id)}
                        >
                          Telemetry
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
