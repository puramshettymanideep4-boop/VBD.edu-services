import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

const Navbar = ({ onNavigate, currentPage, cartCount }) => {
  const { user, currentSchoolPortal, logout, setPortalSchool } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Frosted glass effect after 50px scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (currentSchoolPortal) onNavigate('school-portal');
    else onNavigate('home');
    setMobileMenuOpen(false);
  };

  const handlePortalExit = () => {
    setPortalSchool(null);
    onNavigate('home');
    setMobileMenuOpen(false);
  };

  const getRoleLabel = (role) => {
    if (role === 'VBT_SUPER_ADMIN') return 'Admin';
    if (role === 'PARENT') return 'Parent';
    if (role === 'STUDENT') return 'Student';
    if (role === 'SCHOOL_ADMIN') return 'School Admin';
    return role;
  };

  // Nav link styles with gold underline slide
  const navLinkBase = {
    position: 'relative',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '6px 0',
    transition: 'color 0.3s ease',
    textDecoration: 'none',
    letterSpacing: '0.02em',
  };

  const NavLink = ({ children, onClick, href, active }) => (
    <span
      onClick={onClick}
      style={{
        ...navLinkBase,
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      }}
      className="nav-link-item"
      {...(href ? { as: 'a' } : {})}
    >
      {href ? <a href={href} style={{ color: 'inherit' }}>{children}</a> : children}
      <style>{`
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 1px;
        }
        .nav-link-item:hover { color: var(--text-primary) !important; }
        .nav-link-item:hover::after { width: 100%; }
      `}</style>
    </span>
  );

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%',
        zIndex: 100,
        background: (scrolled || currentSchoolPortal) ? 'rgba(10, 10, 15, 0.96)' : 'transparent',
        backdropFilter: (scrolled || currentSchoolPortal) ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: (scrolled || currentSchoolPortal) ? 'blur(24px)' : 'none',
        borderBottom: (scrolled || currentSchoolPortal) ? '1px solid rgba(200,169,110,0.12)' : '1px solid transparent',
        boxShadow: (scrolled || currentSchoolPortal) ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

        {/* ── Logo ── */}
        <div
          onClick={handleLogoClick}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(200,169,110,0.2), rgba(200,169,110,0.05))',
            border: '1px solid rgba(200,169,110,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-primary)',
            boxShadow: '0 0 20px rgba(200,169,110,0.1)',
            transition: 'all 0.3s ease',
          }}>
            <GraduationCap size={22} />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            letterSpacing: '-0.02em',
          }}>
            VBD
          </span>
          {currentSchoolPortal && (
            <span style={{
              fontSize: '0.8rem',
              color: 'var(--accent-primary)',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              paddingLeft: '12px',
              marginLeft: '4px',
              fontWeight: 500,
              opacity: 0.85,
            }}>
              {currentSchoolPortal.name} Portal
            </span>
          )}
        </div>

        {/* ── Desktop Links ── */}
        <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '28px' }}>
          {!currentSchoolPortal ? (
            <>
              <NavLink onClick={() => onNavigate('home')} active={currentPage === 'home'}>Home</NavLink>
              <NavLink href="#about">About Us</NavLink>
              <NavLink href="#services">Services</NavLink>
              <NavLink href="#schools">Partner Schools</NavLink>
              <NavLink href="#testimonials">Testimonials</NavLink>
              <NavLink href="#faq">FAQs</NavLink>
              <NavLink href="#contact">Contact</NavLink>
            </>
          ) : (
            <>
              <NavLink onClick={() => onNavigate('school-portal')} active={currentPage === 'school-portal'}>Products</NavLink>
              {user && (user.role === 'PARENT' || user.role === 'STUDENT') && (
                <NavLink onClick={() => onNavigate('orders')} active={currentPage === 'orders'}>My Orders</NavLink>
              )}
              <span
                onClick={handlePortalExit}
                style={{ ...navLinkBase, color: 'var(--accent-primary)', cursor: 'pointer' }}
                className="nav-link-item"
              >
                Exit Portal
              </span>
            </>
          )}
        </div>

        {/* ── Desktop Actions ── */}
        <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '14px' }}>
          {user ? (
            <>
              {/* User chip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '30px',
                padding: '6px 14px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}>
                <UserIcon size={13} />
                <span>{user.name || user.email.split('@')[0]}</span>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--accent-primary)',
                  background: 'rgba(200,169,110,0.1)', padding: '2px 8px', borderRadius: '10px',
                }}>
                  {getRoleLabel(user.role)}
                </span>
              </div>

              {/* Cart */}
              {currentSchoolPortal && (user.role === 'PARENT' || user.role === 'STUDENT') && (
                <button
                  className="cart-btn"
                  onClick={() => onNavigate('cart')}
                  style={{ position: 'relative' }}
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      background: 'var(--accent-primary)',
                      color: '#0A0A0F',
                      fontSize: '0.7rem', fontWeight: 700,
                      width: '18px', height: '18px',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: 'bounceBadge 0.3s ease-out',
                    }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Admin dashboard button */}
              {user.role === 'VBT_SUPER_ADMIN' && (
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                  onClick={() => onNavigate('admin-dashboard')}
                >
                  <LayoutDashboard size={14} />
                  Admin
                </button>
              )}

              {/* Logout */}
              <button
                className="cart-btn"
                onClick={logout}
                title="Log Out"
                style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}
              >
                <LogOut size={18} style={{ color: 'var(--danger)' }} />
              </button>
            </>
          ) : (
            <>
              {!currentSchoolPortal ? (
                <button
                  className="btn btn-secondary"
                  style={{ padding: '8px 22px', fontSize: '0.85rem' }}
                  onClick={() => onNavigate('auth')}
                >
                  Portal Login
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 22px', fontSize: '0.85rem' }}
                  onClick={() => onNavigate('auth')}
                >
                  Login to Portal
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            color: 'var(--text-primary)',
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.3s ease',
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      <div style={{
        position: 'fixed',
        top: '72px', left: 0, width: '100%',
        background: 'rgba(10, 10, 15, 0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '24px',
        display: 'flex', flexDirection: 'column', gap: '20px',
        zIndex: 99,
        transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-120%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {!currentSchoolPortal ? (
          <>
            {[
              { label: 'Home', onClick: () => { onNavigate('home'); setMobileMenuOpen(false); } },
              { label: 'About Us', href: '#about' },
              { label: 'Services', href: '#services' },
              { label: 'Partner Schools', href: '#schools' },
              { label: 'FAQs', href: '#faq' },
              { label: 'Contact', href: '#contact' },
            ].map((link) => (
              <span
                key={link.label}
                onClick={() => { link.onClick?.(); setMobileMenuOpen(false); }}
                style={{ color: 'var(--text-secondary)', fontSize: '1rem', cursor: 'pointer', transition: 'color 0.2s' }}
              >
                {link.href ? <a href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ color: 'inherit' }}>{link.label}</a> : link.label}
              </span>
            ))}
          </>
        ) : (
          <>
            <span onClick={() => { onNavigate('school-portal'); setMobileMenuOpen(false); }} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Products</span>
            {user && (user.role === 'PARENT' || user.role === 'STUDENT') && (
              <>
                <span onClick={() => { onNavigate('cart'); setMobileMenuOpen(false); }} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Shopping Cart ({cartCount})</span>
                <span onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>My Orders</span>
              </>
            )}
            <span onClick={handlePortalExit} style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}>Exit Portal</span>
          </>
        )}

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '30px', padding: '6px 14px', fontSize: '0.85rem', color: 'var(--text-secondary)',
              alignSelf: 'flex-start',
            }}>
              <UserIcon size={13} />
              <span>{user.name || user.email.split('@')[0]}</span>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-primary)',
                background: 'rgba(200,169,110,0.1)', padding: '2px 8px', borderRadius: '10px',
              }}>
                {getRoleLabel(user.role)}
              </span>
            </div>
            {user.role === 'VBT_SUPER_ADMIN' && (
              <button className="btn btn-primary" onClick={() => { onNavigate('admin-dashboard'); setMobileMenuOpen(false); }} style={{ justifyContent: 'center' }}>
                <LayoutDashboard size={14} /> Admin Dashboard
              </button>
            )}
            <button className="btn btn-danger" style={{ justifyContent: 'center' }} onClick={() => { logout(); setMobileMenuOpen(false); }}>
              <LogOut size={14} /> Log Out
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}>
            Login to Portal
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
