import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  KeyRound, ArrowLeft, ShieldCheck, RefreshCw,
  GraduationCap, Eye, EyeOff, UserCircle2,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────
   VBD Auth Page  —  dark premium theme (glass card on dark bg)
   Fields:
     Login  : Username (email), Password, School Code, Forgot Password
     Signup : Username, Email, Create Password, Confirm Password
     Forgot : Email → OTP
───────────────────────────────────────────────────────────────────────── */

/* Password input with show / hide toggle — uses dark form-control style */
const PasswordInput = ({ id, value, onChange, placeholder = '••••••••', required = true }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control"
        style={{ paddingRight: '44px' }}
        required={required}
        autoComplete="current-password"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow(v => !v)}
        style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center',
        }}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
};

const AuthPage = ({ onNavigate }) => {
  const {
    login, signup,
    verifySchoolCode, setPortalSchool,
    requestOtp, verifyOtp, resetPassword,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('login');

  /* Login fields */
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginCode, setLoginCode]         = useState('');

  /* Signup fields */
  const [signupName, setSignupName]         = useState('');
  const [signupEmail, setSignupEmail]       = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm]   = useState('');

  /* Forgot / OTP fields */
  const [resetEmail, setResetEmail]         = useState('');
  const [otpStep, setOtpStep]               = useState(false);
  const [otpCode, setOtpCode]               = useState('');
  const [simulatedOtp, setSimulatedOtp]     = useState(null);

  /* UI */
  const [uiError, setUiError]     = useState('');
  const [uiMessage, setUiMessage] = useState('');
  const [loading, setLoading]     = useState(false);

  const clearMsg  = () => { setUiError(''); setUiMessage(''); };
  const switchTab = (tab) => { setActiveTab(tab); clearMsg(); setOtpStep(false); };

  /* ── School code blur — pre-verify for login ── */
  const handleCodeBlur = () => {
    if (loginCode.trim()) {
      const match = verifySchoolCode(loginCode);
      if (match) {
        setPortalSchool(match);
        clearMsg();
      } else {
        setUiError('Invalid or inactive School Code. Verify with your school board.');
        setPortalSchool(null);
      }
    }
  };

  /* ── LOGIN ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMsg();
    if (!loginEmail || !loginPassword) {
      setUiError('Username and Password are required.');
      return;
    }
    const codeToUse = loginCode.trim() || undefined;
    setLoading(true);
    try {
      const res = await login(loginEmail, loginPassword, codeToUse);
      if (res.success) {
        if (res.role === 'VBT_SUPER_ADMIN' || res.role === 'SUPER_ADMIN') {
          onNavigate('admin-dashboard');
        } else {
          onNavigate('school-portal');
        }
      } else {
        setUiError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch { setUiError('System error. Please try again.'); }
    finally { setLoading(false); }
  };

  /* ── SIGNUP ── */
  const handleSignup = async (e) => {
    e.preventDefault();
    clearMsg();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setUiError('All fields are required.');
      return;
    }
    if (signupPassword.length < 6) {
      setUiError('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setUiError('Passwords do not match. Please re-enter.');
      return;
    }
    setLoading(true);
    try {
      const res = await signup(signupName, signupEmail, signupPassword);
      if (res && res.success) {
        setUiMessage('Account created! Please go to Login and enter your School Code to access your portal.');
        // Switch to login tab after a short delay
        setTimeout(() => switchTab('login'), 2200);
      } else {
        setUiError(res?.error || 'Registration failed. Please try again.');
      }
    } catch { setUiError('System error. Please try again.'); }
    finally { setLoading(false); }
  };

  /* ── FORGOT — send OTP ── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    clearMsg();
    if (!resetEmail) { setUiError('Enter your registered email address.'); return; }
    setLoading(true);
    try {
      await resetPassword(resetEmail);
      const res = await requestOtp(resetEmail);
      if (res.success) {
        setOtpStep(true);
        setSimulatedOtp(res.otpCode || null);
        setUiMessage('A one-time code has been sent to your email.');
      } else {
        setUiError('Failed to send OTP. Please try again.');
      }
    } catch { setUiError('System error. Please try again.'); }
    finally { setLoading(false); }
  };

  /* ── FORGOT — verify OTP ── */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearMsg();
    if (!otpCode) { setUiError('Enter your OTP code.'); return; }
    setLoading(true);
    try {
      const res = await verifyOtp(resetEmail, otpCode);
      if (res.success) {
        setUiMessage('Verified! Your password has been reset to "password". You can now log in.');
        setOtpStep(false);
        setTimeout(() => switchTab('login'), 2400);
      } else {
        setUiError(res.error || 'Invalid OTP. Please try again.');
      }
    } catch { setUiError('Verification error. Please try again.'); }
    finally { setLoading(false); }
  };

  /* ── Shared tab pill component ── */
  const TabPill = ({ tabKey, label }) => (
    <div
      onClick={() => switchTab(tabKey)}
      style={{
        flex: 1, padding: '11px', textAlign: 'center',
        fontSize: '0.88rem', fontWeight: 600, borderRadius: '8px',
        cursor: 'pointer', transition: 'all 0.3s ease',
        background: activeTab === tabKey ? 'var(--accent-primary)' : 'transparent',
        color: activeTab === tabKey ? '#0A0A0F' : 'var(--text-muted)',
        userSelect: 'none',
      }}
    >
      {label}
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px 60px',
      position: 'relative',
    }}>

      {/* Dark radial background — same as rest of app */}
      <div className="bg-radial" />

      {/* ── Glass Card ── */}
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

        {/* Back to Home */}
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

        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Logo badge */}
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg,rgba(200,169,110,0.15),rgba(200,169,110,0.05))',
            border: '1px solid rgba(200,169,110,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-primary)',
            margin: '0 auto 16px',
            boxShadow: '0 0 20px rgba(200,169,110,0.1)',
          }}>
            {activeTab === 'signup' ? <UserCircle2 size={26} /> : <GraduationCap size={26} />}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 400,
            color: 'var(--text-primary)', marginBottom: '8px',
          }}>
            {activeTab === 'login'  && 'Welcome Back'}
            {activeTab === 'signup' && 'Create Account'}
            {activeTab === 'forgot' && 'Recover Access'}
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            {activeTab === 'login'  && 'Login to access your school portal.'}
            {activeTab === 'signup' && 'Register a new VBD profile.'}
            {activeTab === 'forgot' && 'Reset your password via email OTP.'}
          </p>
        </div>

        {/* ── ALERTS ── */}
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

        {/* ═══════════════ FORGOT PASSWORD VIEW ═══════════════ */}
        {activeTab === 'forgot' ? (
          <>
            {!otpStep ? (
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email" value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="form-control" required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                  disabled={loading}
                >
                  <RefreshCw size={14} />
                  {loading ? 'Sending OTP…' : 'Send OTP Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                {simulatedOtp && (
                  <div style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(200,169,110,0.4)',
                    padding: '12px', borderRadius: '8px', fontSize: '0.8rem', textAlign: 'center',
                    color: 'var(--accent-primary)', marginBottom: '20px',
                  }}>
                    [DEMO] Your OTP is: <strong style={{ letterSpacing: '0.2em' }}>{simulatedOtp}</strong>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Enter 6-Digit OTP</label>
                  <input
                    type="text" maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="1 2 3 4 5 6"
                    className="form-control"
                    style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.4em' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                  disabled={loading}
                >
                  <ShieldCheck size={16} />
                  {loading ? 'Verifying…' : 'Verify & Reset Password'}
                </button>

                <span
                  onClick={handleSendOtp}
                  style={{
                    display: 'block', textAlign: 'center', marginTop: '14px',
                    fontSize: '0.82rem', color: 'var(--accent-primary)',
                    cursor: 'pointer', transition: 'opacity 0.2s',
                  }}
                >
                  Resend OTP
                </span>
              </form>
            )}

            <span
              onClick={() => switchTab('login')}
              style={{
                display: 'block', textAlign: 'center', marginTop: '18px',
                fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ← Back to Login
            </span>
          </>
        ) : (
          <>
            {/* ── Tab pills: Login / Sign Up ── */}
            <div style={{
              display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: '10px',
              padding: '4px', marginBottom: '28px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <TabPill tabKey="login"  label="Login" />
              <TabPill tabKey="signup" label="Sign Up" />
            </div>

            {/* ═══════════════ LOGIN FORM ═══════════════ */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin}>

                {/* Username / Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">Username</label>
                  <input
                    id="login-email"
                    type="text" value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="Email or username"
                    className="form-control" required
                    autoComplete="username"
                  />
                </div>

                {/* Password */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" htmlFor="login-password" style={{ margin: 0 }}>Password</label>
                    <span
                      onClick={() => switchTab('forgot')}
                      style={{ fontSize: '0.76rem', color: 'var(--accent-primary)', cursor: 'pointer' }}
                    >
                      Forgot Password?
                    </span>
                  </div>
                  <PasswordInput
                    id="login-password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                  />
                </div>

                {/* School Code */}
                <div className="form-group">
                  <label className="form-label" htmlFor="login-code">School Code</label>
                  <input
                    id="login-code"
                    type="text" value={loginCode}
                    onChange={e => setLoginCode(e.target.value.toUpperCase())}
                    onBlur={handleCodeBlur}
                    placeholder="e.g. KAKATIYA123 (leave blank for admin)"
                    className="form-control"
                    style={{ textTransform: 'uppercase' }}
                    autoComplete="off" autoCorrect="off" spellCheck={false}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                  disabled={loading}
                >
                  <KeyRound size={16} />
                  {loading ? 'Authorizing…' : 'Access Portal'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                  No account?{' '}
                  <span
                    onClick={() => switchTab('signup')}
                    style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}
                  >
                    Sign up
                  </span>
                </p>
              </form>
            )}

            {/* ═══════════════ SIGNUP FORM ═══════════════ */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup}>

                {/* Username */}
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-name">Username</label>
                  <input
                    id="signup-name"
                    type="text" value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                    placeholder="Your full name"
                    className="form-control" required
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email"
                    type="email" value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="form-control" required
                    autoComplete="email"
                  />
                </div>

                {/* Create Password */}
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-password">Create Password</label>
                  <PasswordInput
                    id="signup-password"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                  />
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
                  <PasswordInput
                    id="signup-confirm"
                    value={signupConfirm}
                    onChange={e => setSignupConfirm(e.target.value)}
                    placeholder="Repeat your password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                  disabled={loading}
                >
                  <UserCircle2 size={16} />
                  {loading ? 'Creating Account…' : 'Create Account'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                  Already registered?{' '}
                  <span
                    onClick={() => switchTab('login')}
                    style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}
                  >
                    Login
                  </span>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
