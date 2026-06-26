import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

const Footer = ({ onNavigate }) => {
  const { cmsContent } = useDatabase();

  const linkStyle = {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    textDecoration: 'none',
  };

  const SocialLink = ({ href, title, children }) => (
    <a
      href={href || '#'}
      title={title}
      style={{
        width: '38px', height: '38px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'var(--text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(200,169,110,0.1)';
        e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)';
        e.currentTarget.style.color = 'var(--accent-primary)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 0 15px rgba(200,169,110,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </a>
  );

  const FooterLink = ({ onClick, href, children }) => (
    <span
      onClick={onClick}
      style={linkStyle}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--accent-primary)';
        e.currentTarget.style.paddingLeft = '4px';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.paddingLeft = '0';
      }}
    >
      {href ? <a href={href} style={{ color: 'inherit' }}>{children}</a> : children}
    </span>
  );

  return (
    <footer style={{
      background: 'var(--bg-primary)',
      borderTop: '1px solid rgba(200,169,110,0.15)',
      paddingTop: '60px',
      paddingBottom: '32px',
      marginTop: '80px',
      position: 'relative',
    }}>
      {/* Gold top glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.5), transparent)',
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '280px' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              onClick={() => onNavigate('home')}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(200,169,110,0.2), rgba(200,169,110,0.05))',
                border: '1px solid rgba(200,169,110,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}>
                <GraduationCap size={20} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
              }}>
                VBD Education
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Providing top-tier logistics and cataloging services for elite schools.
              Empowering school administrations, parents, and students with simplified
              procurement pipelines and quality guaranteed products.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <SocialLink href="#" title="Facebook">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" title="Twitter / X">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" title="LinkedIn">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" title="Contact Desk">
                <MessageSquare size={15} />
              </SocialLink>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--accent-primary)', letterSpacing: '1.5px', textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink onClick={() => onNavigate('home')}>Home</FooterLink>
              <FooterLink href="#about">About Us</FooterLink>
              <FooterLink href="#schools">Partner Schools</FooterLink>
              <FooterLink href="#faq">FAQs</FooterLink>
              <FooterLink href="#contact">Contact Us</FooterLink>
              <FooterLink onClick={() => onNavigate('auth')}>School Portal Login</FooterLink>
            </div>
          </div>

          {/* Services */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--accent-primary)', letterSpacing: '1.5px', textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              Our Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink href="#services">Curriculum Textbooks</FooterLink>
              <FooterLink href="#services">Orthopedic Bags</FooterLink>
              <FooterLink href="#services">Custom Uniforms</FooterLink>
              <FooterLink href="#services">Stationery Packs</FooterLink>
              <FooterLink href="#services">Academic STEM Kits</FooterLink>
              <FooterLink href="#services">School Support</FooterLink>
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--accent-primary)', letterSpacing: '1.5px', textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              Contact Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <MapPin size={16} style={{ color: 'var(--accent-primary)', marginTop: '3px', flexShrink: 0 }} />
                <span>{cmsContent.companyAddress}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Phone size={16} style={{ color: 'var(--accent-primary)', marginTop: '3px', flexShrink: 0 }} />
                <span>{cmsContent.companyPhone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Mail size={16} style={{ color: 'var(--accent-primary)', marginTop: '3px', flexShrink: 0 }} />
                <span>{cmsContent.companyEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            &copy; {new Date().getFullYear()} VBD Education Services Private Limited. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms & Conditions', 'SLA Agreement'].map(t => (
              <a
                key={t} href="#"
                style={{ color: 'var(--text-muted)', fontSize: '0.8rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
