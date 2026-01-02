import { useRef, useEffect } from "react";
import Chart from 'chart.js/auto';

export default function SpeedTelemetry({ value, distance, color, label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (distance.length === 0) return;

    window.chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: distance,
            datasets: [
              {
                label: label,
                borderColor: color, 
                backgroundColor: "rgba(0, 180, 255, 0.1)",
                data: value,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 0,
              },
            ]
          },
          options: {
            responsive: true,
            interaction: { mode: "index", intersect: false },
            scales: {
              x: {
                title: { display: true, text: "Distance (m)" },
              },
              y: {
                title: { display: true, text: "Value" },
              },
            },
          },
        });

  }, [value, distance]);

  return <canvas ref={canvasRef} width={600} height={400} />;
}
