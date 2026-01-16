import React, { useEffect, useRef } from 'react';

const Circuito2D = ({ posiciones }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (posiciones.length === 0) return;

    // Dibujar líneas del circuito
    ctx.beginPath();
    ctx.moveTo(posiciones[0].x, posiciones[0].y);
    posiciones.forEach(pos => {
      ctx.lineTo(pos.x, pos.y);
    });
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dibujar puntos
    posiciones.forEach(pos => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();
    });

  }, [posiciones]);

  return (
  <canvas
    ref={canvasRef}
    width={500}
    height={600}
    className="border rounded bg-light"
  />
);
};

export default Circuito2D;
