import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

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
            label,
            data: value,
            borderColor: color,
            backgroundColor: "rgba(0,0,0,0)",
            borderWidth: 1.5,
            tension: 0.25,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              font: { size: 10 },
            },
            grid: { display: false },
          },
          y: {
            ticks: {
              font: { size: 10 },
            },
            grid: {
              color: "rgba(0,0,0,0.05)",
            },
          },
        },
      },
    });
  }, [value, distance]);

  return (
    <div style={{ height: "180px" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
