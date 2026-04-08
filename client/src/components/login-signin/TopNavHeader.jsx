import { LogOut, Menu, ChevronDown, X, UserCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import logo from "../../assets/logo3.png";

const tabs = [
  { key: 'home',      label: 'Home',      public: true  },
  { key: 'timetable', label: 'Timetable', public: false },
  { key: 'resource',  label: 'Resource',  public: false },
  { key: 'jobs',      label: 'Jobs',      public: false },
  { key: 'ticket',    label: 'Ticket',    public: false },
  { key: 'support',   label: 'Inquiry Support', public: false },
  { key: 'feedback',  label: 'Feedback Manage', public: false },
];

const TopNavHeader = ({ activeTab, onTabClick, user, initials, onLogin, onLogout, onOpenProfile, profilePhoto }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen,   setUserMenuOpen]   = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="w-full px-3 sm:px-4 lg:px-5 flex items-center justify-between h-14 sm:h-16 gap-4">

        {/* ── Brand ── */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
           
              <img src={logo} alt="UniHelp" className="w-20 h-8 object-contain" onError={(e) => { e.target.style.display='none'; }} />
            
            <div className="leading-tight min-w-0">
              <p className="text-[15px] font-bold text-gray-900 leading-none">UniHelp</p>
              <p className="text-[10.5px] text-gray-400 leading-none mt-0.5 tracking-wide">Student Portal</p>
            </div>
          </div>

          {/* ── Desktop nav ── */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onTabClick(tab)}
                  className={`px-4 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Right section ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* User pill */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-150"
                >
                  {/* Avatar */}
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border border-indigo-200 object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-[13px] font-semibold text-gray-900 leading-none">{user.fullName}</p>
                    <p className="text-[10.5px] text-gray-400 leading-none mt-0.5 uppercase tracking-wider">{user.idNumber}</p>
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl overflow-hidden z-50" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}>
                    <button
                      onClick={() => { setUserMenuOpen(false); onOpenProfile(); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <UserCircle2 size={14} />
                      My Profile
                    </button>
                    <button
                      onClick={() => { setUserMenuOpen(false); onLogout(); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={20} className="text-gray-600" /> : <Menu size={20} className="text-gray-600" />}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onLogin('login')}
                className="hidden sm:block px-4 py-2 rounded-lg text-[13px] font-semibold text-blue-600 hover:bg-blue-50 transition-all duration-150 border border-blue-200"
              >
                Login
              </button>
              <button
                onClick={() => onLogin('activate')}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all duration-150"
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', boxShadow: '0 2px 8px rgba(37,99,235,0.30)' }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {/* Mobile user info */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-gray-50">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-indigo-200 object-cover shrink-0"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}
                >
                  {initials}
                </div>
              )}
              <div>
                <p className="text-[14px] font-semibold text-gray-900">{user.fullName}</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">{user.idNumber}</p>
              </div>
            </div>
          )}

          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={`m-${tab.key}`}
                onClick={() => { onTabClick(tab); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                  active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {user && (
            <button
              onClick={() => { onOpenProfile(); setMobileMenuOpen(false); }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-blue-200 text-[14px] font-medium text-blue-700 hover:bg-blue-50 transition-all"
            >
              <UserCircle2 size={15} />
              My Profile
            </button>
          )}

          {user && (
            <button
              onClick={() => { onLogout(); setMobileMenuOpen(false); }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-[14px] font-medium text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
            >
              <LogOut size={15} />
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default TopNavHeader;
