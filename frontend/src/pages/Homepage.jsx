import React, { useState, useEffect, useRef } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import ThreeDCard from '../components/ThreeDCard';
import ContactForm from '../components/ContactForm';
import StarField from '../components/StarField';
import { 
  BookOpen, 
  Backpack, 
  Shirt, 
  PenTool, 
  FlaskConical, 
  Compass, 
  GraduationCap, 
  Award, 
  Sun, 
  Rocket, 
  ArrowRight,
  TrendingUp,
  ChevronDown,
  ShieldCheck,
  Truck,
  Clock,
  Star,
} from 'lucide-react';

/* ── Scroll Reveal Hook ── */
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

/* ── Animated Count ── */
const useCountUp = (target, duration = 1500, active = true) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || !target) return;
    let start = 0;
    const step = Math.max(Math.floor(duration / target), 10);
    const timer = setInterval(() => {
      start += Math.ceil(target / 40);
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, step);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
};

export const Homepage = ({ onNavigate }) => {
  const { cmsContent, schools } = useDatabase();
  const { setPortalSchool } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useScrollReveal();

  // Stats visibility observer
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const schoolsCount   = useCountUp(cmsContent.statsSchools,  1400, statsVisible);
  const studentsCount  = useCountUp(cmsContent.statsStudents, 1600, statsVisible);
  const productsCount  = useCountUp(cmsContent.statsProducts, 1200, statsVisible);
  const ordersCount    = useCountUp(cmsContent.statsOrders,   1800, statsVisible);

  const handleSchoolClick = (school) => {
    setPortalSchool(school);
    onNavigate('auth');
  };

  const getSchoolIcon = (logoName) => {
    switch (logoName) {
      case 'school':  return <GraduationCap size={30} />;
      case 'award':   return <Award size={30} />;
      case 'sun':     return <Sun size={30} />;
      case 'rocket':  return <Rocket size={30} />;
      default:        return <GraduationCap size={30} />;
    }
  };

  const getServiceIcon = (category) => {
    switch (category) {
      case 'Books':               return <BookOpen size={26} />;
      case 'School Bags':         return <Backpack size={26} />;
      case 'Uniforms':            return <Shirt size={26} />;
      case 'Stationery':          return <PenTool size={26} />;
      case 'Educational Kits':    return <FlaskConical size={26} />;
      case 'Learning Materials':  return <Compass size={26} />;
      default:                    return <GraduationCap size={26} />;
    }
  };

  const servicesList = [
    { title: 'Books', desc: 'Approved syllabus curriculum textbook bindings and custom workbook aggregates.', icon: 'Books' },
    { title: 'School Bags', desc: 'Scoliosis-preventing orthopedic strain-reducing multi-compartment carrier packs.', icon: 'School Bags' },
    { title: 'Uniforms', desc: 'Premium custom stitched, anti-microbial logo embroidered academic attire sets.', icon: 'Uniforms' },
    { title: 'Stationery', desc: 'Full study-suite accessories, geometry sets, art materials, and notebook bundles.', icon: 'Stationery' },
    { title: 'Educational Kits', desc: 'Secondary board experimental laboratory devices, electronics breadboards, and chemistry kits.', icon: 'Educational Kits' },
    { title: 'Learning Materials', desc: 'Syllabus-aligned research atlases, reference journals, and homework guides.', icon: 'Learning Materials' },
    { title: 'School Support Services', desc: 'Direct portal supply integrations, storage logistics management, and bulk delivery routes.', icon: 'Support' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {/* Star field canvas */}
      <StarField />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        paddingTop: '120px', paddingBottom: '80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Radial gold center glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 60%, rgba(200,169,110,0.07) 0%, transparent 70%)',
        }} />

        <div className="container" style={{ width: '100%', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'clamp(300px, 55%, 700px) 1fr',
            gap: '60px', alignItems: 'center',
          }}
          className="hero-grid"
          >
            {/* ── Text ── */}
            <div style={{ animation: 'fadeIn 0.9s cubic-bezier(0.16,1,0.3,1) forwards' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(200,169,110,0.08)',
                border: '1px solid rgba(200,169,110,0.2)',
                borderRadius: '30px', padding: '6px 16px',
                fontSize: '0.72rem', fontWeight: 600,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: 'var(--accent-primary)',
                marginBottom: '28px',
              }}>
                <Star size={11} fill="currentColor" />
                Premium Educational Supply Platform
              </div>

              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(38px, 5vw, 60px)',
                fontWeight: 300,
                letterSpacing: '-1.5px',
                lineHeight: 1.15,
                marginBottom: '8px',
                color: 'var(--text-primary)',
              }}>
                {cmsContent.heroTitle.split(' ').slice(0, Math.ceil(cmsContent.heroTitle.split(' ').length / 2)).join(' ')}
              </h1>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(38px, 5vw, 60px)',
                fontWeight: 400,
                fontStyle: 'italic',
                letterSpacing: '-1.5px',
                lineHeight: 1.15,
                marginBottom: '28px',
              }} className="shimmer-gold-text">
                {cmsContent.heroTitle.split(' ').slice(Math.ceil(cmsContent.heroTitle.split(' ').length / 2)).join(' ')}
              </h1>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem', lineHeight: 1.75,
                maxWidth: '520px',
                marginBottom: '40px',
              }}>
                {cmsContent.heroSubtitle}
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href="#services"
                  className="btn btn-primary ripple"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  Explore Services
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#schools"
                  className="btn btn-secondary"
                >
                  Partner Portals
                </a>
                <a
                  href="#contact"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 28px', borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem', fontWeight: 600,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* ── Floating icons ── */}
            <div className="hero-icons" style={{ position: 'relative', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute', width: '220px', height: '220px',
                borderRadius: '50%',
                border: '1px solid rgba(200,169,110,0.06)',
                animation: 'spin-slow 25s linear infinite',
              }} />
              <div style={{
                position: 'absolute', width: '160px', height: '160px',
                borderRadius: '50%',
                border: '1px solid rgba(200,169,110,0.04)',
                animation: 'spin-slow 18s linear infinite reverse',
              }} />

              {/* Book icon */}
              <div className="animate-float-slow" style={{
                position: 'absolute', top: '30px', left: '20px',
                background: 'rgba(200,169,110,0.12)',
                border: '1px solid rgba(200,169,110,0.25)',
                color: 'var(--accent-primary)',
                padding: '18px', borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(200,169,110,0.12)',
                backdropFilter: 'blur(10px)',
              }}>
                <BookOpen size={34} />
              </div>

              {/* Graduation cap */}
              <div className="animate-float" style={{
                background: 'rgba(200,169,110,0.15)',
                border: '1px solid rgba(200,169,110,0.3)',
                color: 'var(--accent-secondary)',
                padding: '22px', borderRadius: '24px',
                boxShadow: '0 12px 40px rgba(200,169,110,0.15), 0 0 60px rgba(200,169,110,0.06)',
              }}>
                <GraduationCap size={48} />
              </div>

              {/* Flask icon */}
              <div className="animate-float-medium" style={{
                position: 'absolute', bottom: '50px', right: '20px',
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.2)',
                color: 'var(--success)',
                padding: '16px', borderRadius: '18px',
                boxShadow: '0 8px 24px rgba(74,222,128,0.1)',
                backdropFilter: 'blur(10px)',
              }}>
                <FlaskConical size={30} />
              </div>

              {/* Compass */}
              <div className="animate-float-slow" style={{
                position: 'absolute', top: '160px', right: '40px',
                background: 'rgba(96,165,250,0.08)',
                border: '1px solid rgba(96,165,250,0.2)',
                color: 'var(--info)',
                padding: '14px', borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                animationDelay: '1.5s',
              }}>
                <Compass size={26} />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          animation: 'scrollBounce 2s ease-in-out infinite',
          cursor: 'pointer',
          opacity: 0.6,
        }}
          onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 600 }}>scroll</span>
          <ChevronDown size={18} style={{ color: 'var(--accent-primary)' }} />
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
            .hero-icons { display: none !important; }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS BAR
          ══════════════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 'var(--border-radius-md)',
            boxShadow: 'var(--glass-shadow)',
            overflow: 'hidden',
          }}
          className="stats-grid"
          >
            {[
              { value: schoolsCount, suffix: '+', label: 'Partner Schools' },
              { value: studentsCount.toLocaleString(), suffix: '+', label: 'Students Served' },
              { value: productsCount, suffix: '+', label: 'Products Catalogued' },
              { value: ordersCount.toLocaleString(), suffix: '+', label: 'Orders Fulfilled' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '36px 24px',
                  textAlign: 'center',
                  borderRight: i < 3 ? '1px solid rgba(200,169,110,0.08)' : 'none',
                  transition: 'background 0.3s ease',
                }}
                className="scroll-reveal stat-item"
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,169,110,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}>
                  {stat.value}{stat.suffix}
                </div>
                <div style={{
                  fontSize: '0.72rem', fontWeight: 500,
                  letterSpacing: '1.5px', textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr !important; } .stat-item { border-right: none !important; border-bottom: 1px solid rgba(200,169,110,0.08); } }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ABOUT SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="about" style={{
        padding: '100px 0',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--accent-primary)', display: 'block', marginBottom: '16px',
            }}>
              Who We Are
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 400, color: 'var(--text-primary)', marginBottom: '16px',
            }}>
              About VBD Services
            </h2>
            <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', margin: '0 auto 20px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Onboarding elite institutions onto a frictionless procurement highway.
            </p>
          </div>

          {/* Mission / Vision */}
          <div className="scroll-reveal" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px', marginBottom: '48px',
          }}>
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Award size={20} /> Our Mission
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {cmsContent.missionText}
              </p>
            </div>
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ color: 'var(--info)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <TrendingUp size={20} /> Our Vision
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {cmsContent.visionText}
              </p>
            </div>
          </div>

          {/* Feature trio */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: <ShieldCheck size={32} />,
                color: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)', text: 'var(--info)',
                title: 'Isolated Security',
                desc: 'Each school gets a firewall-protected node. Parents only see products assigned to their institution.',
              },
              {
                icon: <Truck size={32} />,
                color: 'rgba(200,169,110,0.12)', border: 'rgba(200,169,110,0.25)', text: 'var(--accent-primary)',
                title: 'Smart Fulfillment',
                desc: 'Centralized dispatch system from VBD HQ to the parent\'s doorstep. Real-time delivery tracking.',
              },
              {
                icon: <Clock size={32} />,
                color: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.25)', text: 'var(--success)',
                title: 'Zero Hassle Administration',
                desc: 'Schools don\'t manage inventory, collect cash, or handle logistics. Everything is automated.',
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="glass-card scroll-reveal"
                style={{ padding: '40px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  background: feat.color, border: `1px solid ${feat.border}`,
                  color: feat.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '24px',
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '12px', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                  {feat.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SERVICES SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="services" style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--accent-primary)', display: 'block', marginBottom: '16px',
            }}>
              What We Offer
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 400, color: 'var(--text-primary)', marginBottom: '16px',
            }}>
              Premium Services Catalog
            </h2>
            <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', margin: '0 auto 20px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Explore our extensive logistical coverage for schools, students, and parent portal supplies.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {servicesList.map((service, idx) => (
              <ThreeDCard key={idx} className="scroll-reveal" style={{ animationDelay: `${idx * 0.06}s` }}>
                <div style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)',
                    color: 'var(--accent-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {getServiceIcon(service.icon)}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                    {service.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.65, flex: 1 }}>
                    {service.desc}
                  </p>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCHOOLS PORTAL SELECTOR
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="schools" style={{
        padding: '100px 0',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--accent-primary)', display: 'block', marginBottom: '16px',
            }}>
              Partner Institutions
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 400, color: 'var(--text-primary)', marginBottom: '16px',
            }}>
              School Portal Access
            </h2>
            <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', margin: '0 auto 20px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Select your partner institution to access your secure, isolated e-commerce supply portal.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {schools.filter(s => s.status?.toLowerCase() !== 'archived').map((school, idx) => {
              const isActive = school.status?.toLowerCase() === 'active';
              return (
                <ThreeDCard
                  key={school.id}
                  onClick={isActive ? () => handleSchoolClick(school) : undefined}
                  className="scroll-reveal"
                  style={{ opacity: isActive ? 1 : 0.5, animationDelay: `${idx * 0.07}s` }}
                >
                  <div style={{
                    padding: '32px 24px',
                    textAlign: 'center',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                  }}>
                    {/* School icon */}
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: isActive ? 'rgba(200,169,110,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isActive ? 'rgba(200,169,110,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: isActive ? '0 0 20px rgba(200,169,110,0.1)' : 'none',
                    }}>
                      {getSchoolIcon(school.logo)}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '4px' }}>
                        {school.name}
                      </h3>
                    </div>

                    {school.announcement && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, textAlign: 'center' }}>
                        {school.announcement}
                      </p>
                    )}

                    <div>
                      {isActive ? (
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
                          color: 'var(--success)', background: 'rgba(74,222,128,0.08)',
                          padding: '4px 12px', borderRadius: '20px',
                          border: '1px solid rgba(74,222,128,0.2)',
                        }}>
                          ● Active Portal
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                          color: 'var(--danger)', background: 'rgba(248,113,113,0.08)',
                          padding: '4px 12px', borderRadius: '20px',
                          border: '1px solid rgba(248,113,113,0.2)',
                        }}>
                          Deactivated
                        </span>
                      )}
                    </div>

                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '0.85rem',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                      fontWeight: 500,
                    }}>
                      {isActive ? 'Enter Portal' : 'Access Blocked'}
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </ThreeDCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="testimonials" style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--accent-primary)', display: 'block', marginBottom: '16px',
            }}>
              Trusted By Schools
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 400, color: 'var(--text-primary)', marginBottom: '16px',
            }}>
              Administrative Feedback
            </h2>
            <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', margin: '0 auto 20px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Read from school directors and parents who partner with us for annual supply onboarding.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {cmsContent.testimonials.map((test, i) => (
              <div
                key={test.id}
                className="glass-card scroll-reveal"
                style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px', animationDelay: `${i * 0.08}s` }}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="var(--accent-primary)" style={{ color: 'var(--accent-primary)' }} />)}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, flex: 1 }}>
                  "{test.content}"
                </p>
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(200,169,110,0.1)',
                    border: '1px solid rgba(200,169,110,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-primary)', flexShrink: 0,
                    fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
                  }}>
                    {test.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{test.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)' }}>{test.role}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{test.schoolName}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="faq" style={{
        padding: '100px 0',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--accent-primary)', display: 'block', marginBottom: '16px',
            }}>
              Got Questions?
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 400, color: 'var(--text-primary)', marginBottom: '16px',
            }}>
              Frequently Asked Questions
            </h2>
            <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', margin: '0 auto 20px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Clear details regarding orders, deliveries, data protection, and school portal access keys.
            </p>
          </div>

          <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cmsContent.faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="glass-card scroll-reveal"
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  style={{
                    padding: '20px 24px', cursor: 'pointer',
                    border: `1px solid ${isOpen ? 'rgba(200,169,110,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)',
                  }}>
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={16}
                      style={{
                        color: 'var(--accent-primary)', flexShrink: 0, marginLeft: '16px',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </div>
                  {isOpen && (
                    <div style={{
                      marginTop: '14px', paddingTop: '14px',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7,
                      animation: 'slideDown 0.3s ease',
                    }}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CONTACT SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--accent-primary)', display: 'block', marginBottom: '16px',
            }}>
              Get In Touch
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 400, color: 'var(--text-primary)', marginBottom: '16px',
            }}>
              Contact Administration
            </h2>
            <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', margin: '0 auto 20px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Onboard your institution, enquire about product lines, or request order resolutions.
            </p>
          </div>

          <ContactForm onReturnHome={() => {
            const el = document.getElementById('home');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} />
        </div>
      </section>
    </div>
  );
};

export default Homepage;
