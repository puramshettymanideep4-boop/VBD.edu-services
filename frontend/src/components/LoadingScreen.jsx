import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap } from 'lucide-react';

const TAGLINE = 'EDUCATIONAL SERVICES';

const LoadingScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('logo');    // 'logo' | 'loader' | 'exit'
  const [progress, setProgress] = useState(0);
  const [typed, setTyped] = useState('');
  const typingRef = useRef(null);
  const progressRef = useRef(null);

  // Phase 1 — show logo for 900 ms, type tagline
  useEffect(() => {
    let charIdx = 0;
    typingRef.current = setInterval(() => {
      charIdx++;
      setTyped(TAGLINE.slice(0, charIdx));
      if (charIdx >= TAGLINE.length) {
        clearInterval(typingRef.current);
        setTimeout(() => setPhase('loader'), 400);
      }
    }, 60);
    return () => clearInterval(typingRef.current);
  }, []);

  // Phase 2 — progress bar
  useEffect(() => {
    if (phase !== 'loader') return;
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(progressRef.current);
          setTimeout(() => {
            setPhase('exit');
            setTimeout(onComplete, 600);
          }, 350);
          return 100;
        }
        return next;
      });
    }, 65);
    return () => clearInterval(progressRef.current);
  }, [phase, onComplete]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'var(--bg-primary)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.6s cubic-bezier(0.85,0,0.15,1), transform 0.6s cubic-bezier(0.85,0,0.15,1)',
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'translateY(-20px)' : 'translateY(0)',
      }}
    >
      {/* Star dots in loader bg */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            borderRadius: '50%',
            background: '#FFF8E6',
            opacity: Math.random() * 0.4 + 0.1,
            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* ── Logo Phase ── */}
      {(phase === 'logo' || phase === 'loader') && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
          animation: phase === 'logo' ? 'logoEntrance 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards' : 'none',
          opacity: phase === 'loader' ? 0.4 : 1,
          transition: 'opacity 0.4s ease',
        }}>
          {/* Logo ring + icon */}
          <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Outer spinning ring */}
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px solid rgba(200,169,110,0.2)',
              borderTopColor: 'var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin-slow 2s linear infinite',
            }} />
            {/* Middle ring */}
            <div style={{
              position: 'absolute', inset: '12px',
              border: '1px solid rgba(200,169,110,0.1)',
              borderBottomColor: 'rgba(200,169,110,0.4)',
              borderRadius: '50%',
              animation: 'spin-slow 3s linear infinite reverse',
            }} />
            {/* Center icon */}
            <div style={{
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(200,169,110,0.15), rgba(200,169,110,0.05))',
              border: '1px solid rgba(200,169,110,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-primary)',
              animation: 'pulseLogo 2s ease-in-out infinite',
            }}>
              <GraduationCap size={32} />
            </div>
          </div>

          {/* Brand name */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.8rem', fontWeight: 700,
              color: 'var(--accent-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              VBD
            </div>
            {/* Typewriter tagline */}
            <div style={{
              fontSize: '0.8rem', fontWeight: 600, letterSpacing: '3px',
              color: 'var(--text-secondary)',
              marginTop: '8px',
              minHeight: '20px',
              fontFamily: 'var(--font-body)',
            }}>
              {typed}
              <span style={{
                display: 'inline-block', width: '2px', height: '14px',
                background: 'var(--accent-primary)',
                marginLeft: '2px', verticalAlign: 'middle',
                animation: 'goldPulse 0.8s ease-in-out infinite',
              }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Loader Phase — progress bar ── */}
      {phase === 'loader' && (
        <div style={{
          marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          animation: 'fadeIn 0.5s ease forwards',
        }}>
          {/* Progress bar */}
          <div style={{
            width: '280px', height: '2px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, progress)}%`,
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
              borderRadius: '2px',
              transition: 'width 0.1s linear',
              boxShadow: '0 0 8px rgba(200,169,110,0.5)',
            }} />
          </div>
          <span style={{
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px',
            color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
            textTransform: 'uppercase',
          }}>
            LOADING PORTAL {Math.min(100, progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
