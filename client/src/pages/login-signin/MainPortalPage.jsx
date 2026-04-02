import { useEffect, useMemo, useState } from 'react';
import AuthModal from '../../components/login-signin/AuthModal';
import PortalTabContent from '../../components/login-signin/PortalTabContent';
import TopNavHeader from '../../components/login-signin/TopNavHeader';
import { getMe } from '../../services/authService';

const MainPortalPage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [token, setToken] = useState(() => localStorage.getItem('unihelp_token') || '');
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(Boolean(localStorage.getItem('unihelp_token')));

  useEffect(() => {
    const loadMe = async () => {
      if (!token) {
        setUser(null);
        setBooting(false);
        return;
      }

      try {
        const result = await getMe(token);
        setUser(result.user);
      } catch (_error) {
        localStorage.removeItem('unihelp_token');
        setToken('');
        setUser(null);
      } finally {
        setBooting(false);
      }
    };

    loadMe();
  }, [token]);

  const initials = useMemo(() => {
    const parts = (user?.fullName || '').trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase() || 'U';
  }, [user?.fullName]);

  const handleTabClick = (tab) => {
    if (!tab.public && !user) {
      setAuthOpen(true);
      return;
    }

    setActiveTab(tab.key);
  };

  const onAuthenticated = ({ token: accessToken, user: authUser }) => {
    localStorage.setItem('unihelp_token', accessToken);
    setToken(accessToken);
    setUser(authUser);
    setAuthOpen(false);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const onLogout = () => {
    localStorage.removeItem('unihelp_token');
    setToken('');
    setUser(null);
    setActiveTab('home');
  };

  const resourceOpen = activeTab === 'resource';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNavHeader
        activeTab={activeTab}
        onTabClick={handleTabClick}
        user={user}
        initials={initials}
        onLogin={openAuth}
        onLogout={onLogout}
      />

      <main className={resourceOpen ? 'w-full px-0 py-0' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'}>
        {booting ? (
          <p className="text-slate-600">Loading your session...</p>
        ) : (
          <PortalTabContent tab={activeTab} user={user} />
        )}
      </main>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        onAuthenticated={onAuthenticated}
      />
    </div>
  );
};

export default MainPortalPage;
