import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Circuito2D from "../tools/PrintCircuit";
import SpeedTelemetry from "../tools/SpeedTelemetry";

export default function Telemetry() {
  const { id } = useParams();

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
    <>
      <h1>Circuit</h1>
      <Circuito2D posiciones={positions} />

      <h2>Velocitat</h2>
      <SpeedTelemetry
        distance={distance}
        value={speed}
        label={"Speed (km/h)"}
        color={"blue"}
      />

      <h2>Accelerador</h2>
      <SpeedTelemetry
        distance={distance}
        value={throttle}
        label={"Throttle"}
        color={"green"}
      />

      <h2>Freno</h2>
      <SpeedTelemetry
        distance={distance}
        value={brake}
        label={"Brake"}
        color={"red"}
      />

      <h2>Marcha</h2>
      <SpeedTelemetry
        distance={distance}
        value={gear}
        label={"Gear"}
        color={"purple"}
      />
    </>
  );
}
