import { useEffect, useMemo, useState } from 'react';
import AuthModal from '../../components/login-signin/AuthModal';
import HomeFooter from '../../components/login-signin/HomeFooter';
import ProfileModal from '../../components/login-signin/ProfileModal';
import PortalTabContent from '../../components/login-signin/PortalTabContent';
import TopNavHeader from '../../components/login-signin/TopNavHeader';
import { getMe, removeProfileImage, uploadProfileImage } from '../../services/authService';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const toAbsoluteProfileUrl = (value) => {
  if (!value) return '';
  return String(value).startsWith('http') ? value : `${API_BASE}${value}`;
};

const MainPortalPage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [token, setToken] = useState(() => localStorage.getItem('unihelp_token') || '');
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
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

  useEffect(() => {
    if (!user?.idNumber) {
      setProfilePhoto('');
      return;
    }

    setProfilePhoto(toAbsoluteProfileUrl(user.profileImageUrl));
  }, [user?.idNumber, user?.profileImageUrl]);

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
    setProfileOpen(false);
    setProfilePhoto('');
    setActiveTab('home');
  };

  const onProfilePhotoChange = async (file) => {
    if (!token) return;
    const response = await uploadProfileImage(token, file);
    setUser(response.user);
    setProfilePhoto(toAbsoluteProfileUrl(response.user?.profileImageUrl));
  };

  const onProfilePhotoRemove = async () => {
    if (!token) return;
    const response = await removeProfileImage(token);
    setUser(response.user);
    setProfilePhoto('');
  };

  const resourceOpen = activeTab === 'resource';
  const blueThemeOpen = activeTab === 'home' || activeTab === 'resource';

  return (
    <div
      className={`min-h-screen text-slate-900 ${
        blueThemeOpen ? 'bg-gradient-to-br from-blue-200 via-blue-50 to-sky-200' : 'bg-slate-50'
      }`}
    >
      <TopNavHeader
        activeTab={activeTab}
        onTabClick={handleTabClick}
        user={user}
        initials={initials}
        onLogin={openAuth}
        onLogout={onLogout}
        onOpenProfile={() => setProfileOpen(true)}
        profilePhoto={profilePhoto}
      />

      <main className={resourceOpen ? 'w-full px-0 py-0' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'}>
        {booting ? (
          <p className="text-slate-600">Loading your session...</p>
        ) : (
          <PortalTabContent
            tab={activeTab}
            user={user}
            profilePhoto={profilePhoto}
            onLogin={openAuth}
            onNavigate={setActiveTab}
          />
        )}
      </main>

      <HomeFooter show={activeTab === 'home' && !booting} />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        onAuthenticated={onAuthenticated}
      />

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        initials={initials}
        profilePhoto={profilePhoto}
        onPhotoChange={onProfilePhotoChange}
        onPhotoRemove={onProfilePhotoRemove}
      />
    </div>
  );
};

export default MainPortalPage;
