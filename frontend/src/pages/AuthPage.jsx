import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, School as SchoolIcon, ShieldCheck, ArrowLeft, RefreshCw, Send, GraduationCap } from 'lucide-react';

const AuthPage = ({ onNavigate }) => {
  const { login, signup, currentSchoolPortal, setPortalSchool, verifySchoolCode, requestOtp, verifyOtp, resetPassword } = useAuth();

  const [activeTab, setActiveTab] = useState('login');
  const [role, setRole] = useState('PARENT');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolCode, setSchoolCode] = useState('');

  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtpSent, setSimulatedOtpSent] = useState(null);

  const [uiError, setUiError] = useState('');
  const [uiMessage, setUiMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSchoolCodeBlur = () => {
    if (schoolCode.trim()) {
      const match = verifySchoolCode(schoolCode);
      if (match) {
        setPortalSchool(match);
        setUiError('');
      } else {
        setUiError('Invalid or inactive School Code. Verify with your school board.');
        setPortalSchool(null);
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setUiError(''); setUiMessage('');
    if (!email || !password) { setUiError('Email and Password are required.'); return; }
    const isSuper = email.trim().toLowerCase() === 'superadmin@vbt.com' || email.trim().toLowerCase() === 'superadmin@vbd.com';
    if (!isSuper && !schoolCode.trim()) { setUiError('School Access Code is required.'); return; }
    setLoading(true);
    try {
      const codeToUse = isSuper ? undefined : schoolCode;
      const res = await login(email, password, codeToUse);
      if (res.success) {
        if (isSuper) onNavigate('admin-dashboard');
        else onNavigate('school-portal');
      } else {
        setUiError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch { setUiError('System error during validation.'); }
    finally { setLoading(false); }
  };

  const handleRequestOtp = async () => {
    setUiError(''); setUiMessage('');
    if (!email) { setUiError('Please enter your email to request an OTP.'); return; }
    setLoading(true);
    try {
      const res = await requestOtp(email);
      if (res.success) {
        setOtpStep(true);
        setSimulatedOtpSent(res.otpCode || null);
        setUiMessage('A one-time OTP code has been dispatched. Enter it below.');
      } else {
        setUiError(res.error || 'Failed to send OTP.');
      }
    } catch { setUiError('Error sending OTP.'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setUiError(''); setUiMessage('');
    if (!otpCode) { setUiError('Enter verification code.'); return; }
    setLoading(true);
    try {
      const res = await verifyOtp(email, otpCode);
      if (res.success) {
        if (activeTab === 'signup') {
          const signupRes = await signup(name, email, role, schoolCode);
          if (signupRes.success) onNavigate('school-portal');
          else { setUiError(signupRes.error || 'Signup failed.'); setOtpStep(false); }
        } else {
          setUiMessage('Verification complete. Your password has been reset to "password". You can now log in.');
          setActiveTab('login'); setPassword('password'); setOtpStep(false);
        }
      } else {
        setUiError(res.error || 'Verification code does not match.');
      }
    } catch { setUiError('System verification error.'); }
    finally { setLoading(false); }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setUiError(''); setUiMessage('');
    if (!name || !email || !schoolCode) { setUiError('All fields are required.'); return; }
    const school = verifySchoolCode(schoolCode);
    if (!school) { setUiError('Provide a valid School Code to register.'); return; }
    handleRequestOtp();
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setUiError(''); setUiMessage('');
    if (!email) { setUiError('Enter your email to request recovery.'); return; }
    setLoading(true);
    try {
      const res = await resetPassword(email);
      if (res.success) handleRequestOtp();
    } catch { setUiError('Password recovery request failed.'); }
    finally { setLoading(false); }
  };

  // Shared input style
  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--text-primary)', fontSize: '0.95rem',
    fontFamily: 'var(--font-body)', outline: 'none',
    transition: 'all 0.3s ease',
  };

  const RoleBtn = ({ value, label }) => (
    <button
      type="button"
      onClick={() => setRole(value)}
      style={{
        flex: 1, padding: '10px 8px',
        background: role === value ? 'rgba(200,169,110,0.1)' : 'transparent',
        border: `1px solid ${role === value ? 'rgba(200,169,110,0.5)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '8px',
        color: role === value ? 'var(--accent-primary)' : 'var(--text-muted)',
        fontSize: '0.82rem', fontWeight: 600,
        transition: 'all 0.3s ease', cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px 60px',
      position: 'relative',
    }}>
      {/* Background layers */}
      <div className="bg-radial" />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '500px',
        background: 'rgba(19,19,31,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 'var(--border-radius-md)',
        padding: '44px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(200,169,110,0.04)',
        animation: 'fadeIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        position: 'relative', zIndex: 1,
      }}>
        {/* Back link */}
        <span
          onClick={() => onNavigate('home')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.87rem', color: 'var(--text-muted)', cursor: 'pointer',
            marginBottom: '24px', transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={14} />
          Main Homepage
        </span>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Logo icon */}
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(200,169,110,0.15), rgba(200,169,110,0.05))',
            border: '1px solid rgba(200,169,110,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-primary)',
            margin: '0 auto 16px',
            boxShadow: '0 0 20px rgba(200,169,110,0.1)',
          }}>
            <GraduationCap size={26} />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 400,
            color: 'var(--text-primary)', marginBottom: '8px',
          }}>
            {activeTab === 'login' ? 'Secure School Portal' : activeTab === 'signup' ? 'Register Account' : 'Recover Password'}
          </h2>

          {currentSchoolPortal ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(200,169,110,0.08)',
              border: '1px solid rgba(200,169,110,0.25)',
              color: 'var(--accent-primary)',
              padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600,
              marginTop: '8px',
            }}>
              <SchoolIcon size={13} />
              {currentSchoolPortal.name}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Enter a valid School Code to target your school's data node.
            </p>
          )}
        </div>

        {/* Alert messages */}
        {uiError && (
          <div style={{
            padding: '12px 16px', borderRadius: '8px',
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
            color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center',
            animation: 'fadeIn 0.3s ease',
          }}>
            {uiError}
          </div>
        )}
        {uiMessage && (
          <div style={{
            padding: '12px 16px', borderRadius: '8px',
            background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
            color: 'var(--success)', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center',
            animation: 'fadeIn 0.3s ease',
          }}>
            {uiMessage}
          </div>
        )}

        {/* OTP Step */}
        {otpStep ? (
          <form onSubmit={handleVerifyOtpSubmit}>
            {simulatedOtpSent && (
              <div style={{
                background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(200,169,110,0.4)',
                padding: '12px', borderRadius: '8px', fontSize: '0.8rem', textAlign: 'center',
                color: 'var(--accent-primary)', marginBottom: '20px',
              }}>
                [SIMULATION DESK] Your OTP is: <strong>{simulatedOtpSent}</strong>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Enter 6-Digit OTP Code *</label>
              <input
                type="text" maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="1 2 3 4 5 6"
                className="form-control"
                style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.4em' }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center' }} disabled={loading}>
              <ShieldCheck size={16} />
              Verify & Complete Access
            </button>
            <span onClick={handleRequestOtp} style={{
              display: 'block', textAlign: 'center', marginTop: '16px',
              fontSize: '0.82rem', color: 'var(--accent-primary)', cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}>
              Resend OTP
            </span>
          </form>
        ) : (
          <>
            {/* Tab pills */}
            {activeTab !== 'reset' && (
              <div style={{
                display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: '10px',
                padding: '4px', marginBottom: '24px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                {[
                  { key: 'login', label: 'Portal Login' },
                  { key: 'signup', label: 'Parent/Student Signup' },
                ].map(tab => (
                  <div
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setUiError(''); setUiMessage(''); }}
                    style={{
                      flex: 1, padding: '11px', textAlign: 'center',
                      fontSize: '0.88rem', fontWeight: 600, borderRadius: '8px',
                      cursor: 'pointer', transition: 'all 0.3s ease',
                      background: activeTab === tab.key ? 'var(--accent-primary)' : 'transparent',
                      color: activeTab === tab.key ? '#0A0A0F' : 'var(--text-muted)',
                    }}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                  <RoleBtn value="PARENT" label="Parent" />
                  <RoleBtn value="STUDENT" label="Student" />
                  <RoleBtn value="SCHOOL_ADMIN" label="School Admin" />
                </div>

                <div className="form-group">
                  <label className="form-label">School Access Code</label>
                  <input
                    type="text" value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                    onBlur={handleSchoolCodeBlur}
                    placeholder="Enter your school code"
                    className="form-control" style={{ textTransform: 'uppercase' }}
                    autoComplete="off" autoCorrect="off" spellCheck={false}
                  />
                  {email.trim().toLowerCase() === 'superadmin@vbt.com' && (
                    <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', display: 'block', marginTop: '4px' }}>
                      Super Admin login — school code not required.
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Registered Email Address *</label>
                  <input
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@school.edu"
                    className="form-control" required
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Password *</label>
                    <span
                      onClick={() => { setActiveTab('reset'); setUiError(''); setUiMessage(''); }}
                      style={{ fontSize: '0.76rem', color: 'var(--accent-primary)', cursor: 'pointer' }}
                    >
                      Forgot?
                    </span>
                  </div>
                  <input
                    type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-control" required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center' }} disabled={loading}>
                  <KeyRound size={16} />
                  {loading ? 'Authorizing Portal…' : 'Access Portal'}
                </button>
              </form>
            )}

            {/* SIGNUP FORM */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                  <RoleBtn value="PARENT" label="Parent" />
                  <RoleBtn value="STUDENT" label="Student" />
                </div>

                <div className="form-group">
                  <label className="form-label">Parent / Student Full Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Srinivas Kumar" className="form-control" required />
                </div>

                <div className="form-group">
                  <label className="form-label">School Onboarding Code *</label>
                  <input
                    type="text" value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                    onBlur={handleSchoolCodeBlur}
                    placeholder="Enter your school code"
                    className="form-control" style={{ textTransform: 'uppercase' }}
                    autoComplete="off" autoCorrect="off" spellCheck={false} required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="parent@kakatiya.edu" className="form-control" required />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center' }} disabled={loading}>
                  <Send size={16} />
                  {loading ? 'Transmitting Request…' : 'Verify Email via OTP'}
                </button>
              </form>
            )}

            {/* RESET FORM */}
            {activeTab === 'reset' && (
              <form onSubmit={handleResetSubmit}>
                <div className="form-group">
                  <label className="form-label">Enter Registered Email *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="parent@kakatiya.edu" className="form-control" required />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center' }} disabled={loading}>
                  <RefreshCw size={14} />
                  Verify Email
                </button>

                <span
                  onClick={() => { setActiveTab('login'); setUiError(''); setUiMessage(''); }}
                  style={{ display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  Back to Login
                </span>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
