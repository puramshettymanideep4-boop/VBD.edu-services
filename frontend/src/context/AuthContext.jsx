import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';
import api from '../services/api';

const AuthContext = createContext(undefined);

// localStorage keys
const TOKEN_KEY   = 'vbt_token';
const SCHOOL_KEY  = 'vbt_selected_school';
const CART_KEY    = 'vbt_cart';

export const AuthProvider = ({ children }) => {
  const { schools, logNotification, refreshData } = useDatabase();
  const [user, setUser]                         = useState(null);
  const [currentSchoolPortal, setCurrentSchoolPortal] = useState(null);
  const [otpStore, setOtpStore]                 = useState({});
  const [authLoading, setAuthLoading]           = useState(true);

  // ── Restore session on page load ──────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
          }
        } catch (e) {
          console.error('Session restore failed', e);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(SCHOOL_KEY);
        }
      }

      // Restore selected school from localStorage (survives page refresh)
      const savedSchool = localStorage.getItem(SCHOOL_KEY);
      if (savedSchool) {
        try {
          setCurrentSchoolPortal(JSON.parse(savedSchool));
        } catch {
          localStorage.removeItem(SCHOOL_KEY);
        }
      }

      setAuthLoading(false);
    };
    restore();
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const persistSchool = (school) => {
    if (school) {
      localStorage.setItem(SCHOOL_KEY, JSON.stringify(school));
    } else {
      localStorage.removeItem(SCHOOL_KEY);
    }
    setCurrentSchoolPortal(school);
  };

  const saveSession = (userData, token) => {
    if (userData && token) {
      localStorage.setItem(TOKEN_KEY, token);
      setUser(userData);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(SCHOOL_KEY);
      localStorage.removeItem(CART_KEY);
      setUser(null);
      setCurrentSchoolPortal(null);
    }
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  // The school code is validated dynamically by the backend against the DB.
  // Any user with valid credentials can access any ACTIVE school by code.
  // The returned `selectedSchool` is stored in state + localStorage — not on the user record.
  const login = async (email, password, schoolCode) => {
    try {
      const res = await api.post('/auth/login', { email, password, schoolCode });
      if (res.data.success) {
        const { token, selectedSchool, ...userData } = res.data.data;
        saveSession(userData, token);

        if (selectedSchool) {
          persistSchool(selectedSchool);
          // Reload products filtered for the selected school
          refreshData(selectedSchool.id);
        } else {
          persistSchool(null);
        }

        logNotification('email', userData.email, `Sign-in detected. Role: ${userData.role}.`).catch(() => {});
        return { success: true, role: userData.role };
      }
      return { success: false, error: 'Authentication failed.' };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Invalid credentials or server error.';
      return { success: false, error: msg };
    }
  };

  // ── Signup ────────────────────────────────────────────────────────────────
  // No school code at signup — user chooses a school at login time.
  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', {
        name, email, password, role: 'PARENT',
      });
      if (res.data.success) {
        return { success: true };
      }
      return { success: false, error: 'Registration failed.' };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Signup failed.' };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => saveSession(null, null);

  // ── setPortalSchool (used by Navbar / homepage school selection) ──────────
  const setPortalSchool = (school) => persistSchool(school);

  // ── verifySchoolCode (local check against loaded schools list) ────────────
  // Used for live feedback in the UI — the authoritative check is on the backend.
  const verifySchoolCode = (code) => {
    const cleaned = code.trim().toUpperCase();
    const found = schools.find(s => s.code?.toUpperCase() === cleaned);
    return found && (found.status === 'active' || found.status === 'ACTIVE') ? found : null;
  };

  // ── OTP helpers ───────────────────────────────────────────────────────────
  const requestOtp = async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpStore(prev => ({ ...prev, [cleanEmail]: otp }));
    logNotification('email', cleanEmail, `Your OTP is ${otp}. Valid for 5 minutes.`);
    return { success: true, otpCode: otp };
  };

  const verifyOtp = async (email, otp) => {
    const cleanEmail = email.trim().toLowerCase();
    if (otpStore[cleanEmail] && otpStore[cleanEmail] === otp) {
      setOtpStore(prev => { const n = { ...prev }; delete n[cleanEmail]; return n; });
      return { success: true };
    }
    return { success: false, error: 'Invalid OTP verification code.' };
  };

  const resetPassword = async (email) => {
    logNotification('email', email.trim().toLowerCase(), 'Password reset request received.');
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      user,
      currentSchoolPortal,
      isAuthenticated: !!user,
      authLoading,
      login,
      signup,
      logout,
      setPortalSchool,
      verifySchoolCode,
      requestOtp,
      verifyOtp,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
