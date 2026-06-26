import React, { useEffect, useRef } from 'react';

/**
 * StarField — renders 80-100 animated star particles on a canvas.
 * Particles drift slowly upward with random opacity, size, and speed.
 */
const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    const STAR_COUNT = 90;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate stars
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x:        Math.random() * canvas.width,
      y:        Math.random() * canvas.height,
      size:     Math.random() * 1.5 + 0.5,          // 0.5 – 2px
      opacity:  Math.random() * 0.5 + 0.1,           // 0.1 – 0.6
      speed:    Math.random() * 0.3 + 0.05,          // upward drift
      twinkle:  Math.random() * Math.PI * 2,         // phase offset
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        // Twinkle
        s.twinkle += s.twinkleSpeed;
        const alpha = s.opacity * (0.5 + 0.5 * Math.sin(s.twinkle));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 230, ${alpha})`;
        ctx.fill();

        // Drift upward
        s.y -= s.speed;
        if (s.y < -2) {
          s.y = canvas.height + 2;
          s.x = Math.random() * canvas.width;
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.8,
      }}
    />
  );
};

export default StarField;
