import React, { useRef, useState } from 'react';

/**
 * ThreeDCard — Antigravity perspective tilt card.
 * On mouse move: subtle 3D tilt (max 8 deg), gold glow follows cursor.
 * On mouse leave: smooth return to rest.
 */
const ThreeDCard = ({ children, className = '', style, onClick }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ rx: 0, ry: 0, glowX: 50, glowY: 50 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const cx = box.width / 2;
    const cy = box.height / 2;

    const maxTilt = 8;
    const rx = -((y - cy) / cy) * maxTilt;
    const ry = ((x - cx) / cx) * maxTilt;
    const glowX = (x / box.width) * 100;
    const glowY = (y / box.height) * 100;

    setCoords({ rx, ry, glowX, glowY });
  };

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => {
    setCoords({ rx: 0, ry: 0, glowX: 50, glowY: 50 });
    setHovering(false);
  };

  const cardStyle = {
    ...style,
    background: 'var(--bg-card)',
    border: `1px solid ${hovering ? 'rgba(200,169,110,0.25)' : 'rgba(255,255,255,0.06)'}`,
    borderRadius: 'var(--border-radius-md)',
    transform: `perspective(800px) rotateX(${coords.rx}deg) rotateY(${coords.ry}deg) translateY(${hovering ? '-8px' : '0'})`,
    boxShadow: hovering
      ? `${-coords.ry * 1.5}px ${-coords.rx * 1.5}px 30px rgba(0,0,0,0.4), 0 24px 64px rgba(0,0,0,0.5), 0 0 30px rgba(200,169,110,0.12)`
      : '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(200,169,110,0.08)',
    transition: hovering
      ? 'box-shadow 0.1s ease, border-color 0.3s ease'
      : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease, border-color 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    transformStyle: 'preserve-3d',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      style={cardStyle}
    >
      {/* Mouse-tracking inner glow */}
      {hovering && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at ${coords.glowX}% ${coords.glowY}%, rgba(200,169,110,0.08) 0%, transparent 60%)`,
          borderRadius: 'inherit',
          zIndex: 0,
          transition: 'background 0.05s ease',
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', transform: 'translateZ(10px)' }}>
        {children}
      </div>
    </div>
  );
};

export default ThreeDCard;
