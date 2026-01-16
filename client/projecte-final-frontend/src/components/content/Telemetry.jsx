import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Circuito2D from "../tools/PrintCircuit";
import SpeedTelemetry from "../tools/SpeedTelemetry";
import { useTranslation } from "react-i18next";

export default function Telemetry() {
  const { id } = useParams();
  const { t } = useTranslation();

  const API_URL = "http://localhost/api";
  const [positions, setPositions] = useState([]);
  const [speed, setSpeed] = useState([]);
  const [distance, setDistance] = useState([]);
  const [throttle, setthrottle] = useState([]);
  const [brake, setBrake] = useState([]);
  const [gear, setGear] = useState([]);

  try {
    useEffect(() => {
      async function getTelemetry() {
        const response = await fetch(`${API_URL}/getTelemetry/` + id);
        const data = await response.json();

        // Getting telemetry data

        // Distance
        setDistance(data.inputs.map((d) => d.d));

        // Speed
        setSpeed(data.inputs.map((s) => s.speed));

        // Throttle
        setthrottle(data.inputs.map((t) => t.throttle));

        // Brake
        setBrake(data.inputs.map((b) => b.brake));

        // Gear
        setGear(data.inputs.map((g) => g.gear));

        // Getting track map

        // Storing data postions X and Z
        const xs = data.positions.map((p) => p.x);
        const zs = data.positions.map((p) => p.z);

        // Getting the max amn min values
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minZ = Math.min(...zs);
        const maxZ = Math.max(...zs);

        // Getting the sizes and margins
        const width = 600;
        const height = 400;
        const margin = 20;

        // Calculate the horizontal scale factor.
        const scaleX = (width - margin * 2) / (maxX - minX);

        // Calculate the vertical scale factor.
        const scaleY = (height - margin * 2) / (maxZ - minZ);

        // Use the smaller scale so the track keeps its aspect ratio and fits entirely inside the canvas
        const scale = Math.min(scaleX, scaleY);

        // Convert raw telemetry positions into canvas coordinates
        const positions = data.positions.map((p) => ({
          // Normalize X to start at 0, apply scale, and add margin
          x: margin + (p.x - minX) * scale,

          // Normalize Z, apply scale, add margin,
          // and invert Y-axis because canvas Y grows downward
          y: height - (margin + (p.z - minZ) * scale),
        }));

        // Setting possitions
        setPositions(positions);
      }

      getTelemetry();
    }, []);
  } catch (error) {
    alert(error);
  }

  return (
    <div className="container-fluid my-4" role="main">
      <div className="row">
        {/* LEFT: Telemetry charts */}
        <section className="col-md-7" aria-label={t("telemetry.leftSection")}>
          <div className="d-flex flex-column gap-4">
            <div>
              <h2 className="text-uppercase text-secondary mb-1">
                {t("telemetry.speed")}
              </h2>
              <SpeedTelemetry
                distance={distance}
                value={speed}
                label={t("telemetry.speedLabel")}
                color="blue"
              />
            </div>

            <div>
              <h2 className="text-uppercase text-secondary mb-1">
                {t("telemetry.throttle")}
              </h2>
              <SpeedTelemetry
                distance={distance}
                value={throttle}
                label={t("telemetry.throttleLabel")}
                color="green"
              />
            </div>

            <div>
              <h2 className="text-uppercase text-secondary mb-1">
                {t("telemetry.brake")}
              </h2>
              <SpeedTelemetry
                distance={distance}
                value={brake}
                label={t("telemetry.brakeLabel")}
                color="red"
              />
            </div>

            <div>
              <h2 className="text-uppercase text-secondary mb-1">
                {t("telemetry.gear")}
              </h2>
              <SpeedTelemetry
                distance={distance}
                value={gear}
                label={t("telemetry.gearLabel")}
                color="purple"
              />
            </div>
          </div>
        </section>

        {/* RIGHT: Circuit */}
        <section className="col-md-5" aria-label={t("telemetry.rightSection")}>
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h2 className="fw-bold mb-3">{t("telemetry.circuitTitle")}</h2>
              <Circuito2D
                posiciones={positions}
                aria-label={t("telemetry.circuitAriaLabel")}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
