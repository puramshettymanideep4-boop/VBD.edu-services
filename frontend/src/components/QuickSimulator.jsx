import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { Database, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';

const QuickSimulator = ({ onNavigate }) => {
  const { login, logout, user } = useAuth();
  const { resetDatabase, logNotification } = useDatabase();
  const [isOpen, setIsOpen] = useState(false);

  const simulateLogin = async (email, schoolCode, redirectPage = 'school-portal') => {
    logout();
    setTimeout(async () => {
      const res = await login(email, 'password', schoolCode);
      if (res.success) {
        onNavigate(redirectPage);
        logNotification(
          'email',
          'system@vbt.com',
          `[TEST SUITE] Automated quick login executed for "${email}" (Portal: ${schoolCode || 'VBT Dashboard'})`
        );
      }
    }, 100);
  };

  const handleReset = () => {
    if (window.confirm('Reset local database to initial factory defaults? This will erase all custom orders, CMS changes, and school additions.')) {
      resetDatabase();
      logout();
      onNavigate('home');
    }
  };

  const simBtnBase = "w-full px-3 py-2 rounded-md text-[0.8rem] font-semibold flex items-center justify-between bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-white transition-all duration-300 hover:bg-[rgba(0,82,204,0.15)] hover:border-primary hover:-translate-x-0.5";
  const simBtnActive = "!border-gold !bg-[rgba(212,175,55,0.05)] !text-gold";

  const badgeBase = "text-[0.65rem] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-[#94A3B8]";
  const badgeActive = "!bg-[rgba(212,175,55,0.2)] !text-gold";

  return (
    <div className={`fixed bottom-5 right-5 z-[9999] bg-[rgba(15,34,68,0.95)] backdrop-blur-[15px] border border-gold rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_15px_rgba(212,175,55,0.2)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col overflow-hidden ${isOpen ? 'w-[280px] translate-x-0' : 'w-[300px] translate-x-[calc(100%-46px)]'}`}>

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[rgba(212,175,55,0.1)] border-b border-[rgba(212,175,55,0.2)] cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="font-heading text-[0.85rem] font-bold text-gold flex items-center gap-2 tracking-[0.05em]">
          <Database size={14} />
          <span>PORTAL DEMO SIMULATOR</span>
        </div>
        <button className="bg-transparent text-gold p-0.5 rounded flex items-center justify-center">
          {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Body panel */}
      {isOpen && (
        <div className="p-4 flex flex-col gap-[14px]">
          <div className="p-2.5 bg-[rgba(0,0,0,0.3)] rounded-md text-[0.75rem] text-[#94A3B8] leading-[1.4]">
            {user ? (
              <p>
                Logged in as: <strong className="text-white">{user.name}</strong>
                <br />
                Role: <strong className="text-gold">{user.role}</strong>
                {user.schoolName && <><br />School: <strong className="text-[#60A5FA]">{user.schoolName}</strong></>}
              </p>
            ) : (
              <p className="text-[#64748B]">Status: Public Visitor (Logged Out)</p>
            )}
          </div>

          {/* Super Admin Section */}
          <div>
            <div className="text-[0.75rem] font-bold text-[#94A3B8] tracking-[0.05em] mb-1.5 border-b border-[rgba(255,255,255,0.05)] pb-1">VBT SYSTEM MANAGEMENT</div>
            <div className="flex flex-col gap-2">
              <button
                className={`${simBtnBase} ${user?.role === 'VBT_SUPER_ADMIN' ? simBtnActive : ''}`}
                onClick={() => simulateLogin('superadmin@vbt.com', undefined, 'admin-dashboard')}
              >
                <span>VBT Super Admin</span>
                <span className={`${badgeBase} ${user?.role === 'VBT_SUPER_ADMIN' ? badgeActive : ''}`}>Admin Panel</span>
              </button>
            </div>
          </div>

          {/* School Isolation Testing */}
          <div>
            <div className="text-[0.75rem] font-bold text-[#94A3B8] tracking-[0.05em] mb-1.5 border-b border-[rgba(255,255,255,0.05)] pb-1">DATA ISOLATION PORTALS</div>
            <div className="flex flex-col gap-2">
              <button
                className={`${simBtnBase} ${user?.email === 'parent@kakatiya.edu' ? simBtnActive : ''}`}
                onClick={() => simulateLogin('parent@kakatiya.edu', 'KAKATIYA123')}
              >
                <span>Kakatiya School Parent</span>
                <span className={`${badgeBase} ${user?.email === 'parent@kakatiya.edu' ? badgeActive : '!text-[#60A5FA]'}`}>Kakatiya</span>
              </button>

              <button
                className={`${simBtnBase} ${user?.email === 'student@kakatiya.edu' ? simBtnActive : ''}`}
                onClick={() => simulateLogin('student@kakatiya.edu', 'KAKATIYA123')}
              >
                <span>Kakatiya Student</span>
                <span className={`${badgeBase} ${user?.email === 'student@kakatiya.edu' ? badgeActive : '!text-[#60A5FA]'}`}>Kakatiya</span>
              </button>

              <button
                className={`${simBtnBase} ${user?.email === 'parent@abc.edu' ? simBtnActive : ''}`}
                onClick={() => simulateLogin('parent@abc.edu', 'ABC456')}
              >
                <span>ABC School Parent</span>
                <span className={`${badgeBase} ${user?.email === 'parent@abc.edu' ? badgeActive : '!text-success'}`}>ABC School</span>
              </button>
            </div>
          </div>

          {/* Reset / Logout utilities */}
          <div className="mt-1">
            <div className="text-[0.75rem] font-bold text-[#94A3B8] tracking-[0.05em] mb-1.5 border-b border-[rgba(255,255,255,0.05)] pb-1">UTILITIES</div>
            <div className="flex gap-2">
              <button
                className={`${simBtnBase} justify-center bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]`}
                onClick={() => { logout(); onNavigate('home'); }}
              >
                Logout
              </button>
              <button
                className={`${simBtnBase} justify-center gap-[6px]`}
                onClick={handleReset}
              >
                <RefreshCw size={12} />
                Reset DB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickSimulator;
