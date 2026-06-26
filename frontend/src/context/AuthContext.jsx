import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';
import api from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { schools, logNotification } = useDatabase();
  const [user, setUser] = useState(null);
  const [currentSchoolPortal, setCurrentSchoolPortal] = useState(null);
  const [otpStore, setOtpStore] = useState({});
  const [authLoading, setAuthLoading] = useState(true);

  // Restore session from backend using stored token
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('vbt_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            if (res.data.data.schoolId) {
              setCurrentSchoolPortal(res.data.data.schoolId);
            }
          }
        } catch (e) {
          console.error('Failed to restore auth session', e);
          localStorage.removeItem('vbt_token');
        }
      }
      setAuthLoading(false);
    };
    checkUser();
  }, []);

  const saveSession = (u, token) => {
    if (u && token) {
      localStorage.setItem('vbt_token', token);
      setUser(u);
    } else {
      localStorage.removeItem('vbt_token');
      setUser(null);
      setCurrentSchoolPortal(null);
    }
  };

  const verifySchoolCode = (code) => {
    const cleanedCode = code.trim().toUpperCase();
    const found = schools.find(s => s.code.toUpperCase() === cleanedCode);
    return found && found.status === 'active' ? found : null;
  };

  const login = async (email, password, schoolCode) => {
    try {
      const res = await api.post('/auth/login', { email, password, schoolCode });
      if (res.data.success) {
        const authUser = res.data.data;
        saveSession(authUser, authUser.token);

        if (authUser.school) {
          setCurrentSchoolPortal(authUser.school);
        } else {
          setCurrentSchoolPortal(null);
        }

        // Fire-and-forget — never let this block or break the login flow
        logNotification('email', authUser.email, `New sign-in detected. Role: ${authUser.role}.`).catch(() => {});

        return { success: true };
      }
      return { success: false, error: 'Authentication failed.' };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Invalid credentials or server error.' };
    }
  };


  const signup = async (name, email, role, schoolCode) => {
    const school = verifySchoolCode(schoolCode);
    if (!school && role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Invalid or inactive school code.' };
    }

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password: 'password', // Default password per original mock logic
        role,
        schoolCode,
      });

      if (res.data.success) {
        const newUser = res.data.data;
        saveSession(newUser, newUser.token);
        
        if (school) {
          setCurrentSchoolPortal(school);
        }

        logNotification('email', newUser.email, `Welcome to VBD! Your profile has been created successfully. Access Code: ${schoolCode}.`);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Signup failed.' };
    }
  };

  const logout = () => {
    saveSession(null, null);
  };

  const setPortalSchool = (school) => {
    setCurrentSchoolPortal(school);
    if (user && user.role !== 'VBT_SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') {
      if (user.schoolId && user.schoolId._id !== school?.id) {
        logout();
      }
    }
  };

  const requestOtp = async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpStore(prev => ({ ...prev, [cleanEmail]: otp }));
    logNotification('email', cleanEmail, `Verification Request: Your one-time login OTP is ${otp}. Valid for 5 minutes.`);
    return { success: true, otpCode: otp };
  };

  const verifyOtp = async (email, otp) => {
    const cleanEmail = email.trim().toLowerCase();
    if (otpStore[cleanEmail] && otpStore[cleanEmail] === otp) {
      setOtpStore(prev => {
        const next = { ...prev };
        delete next[cleanEmail];
        return next;
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid OTP verification code.' };
  };

  const resetPassword = async (email) => {
    logNotification('email', email.trim().toLowerCase(), 'Password reset request received. A password reset link has been dispatched to your email.');
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
      resetPassword
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
