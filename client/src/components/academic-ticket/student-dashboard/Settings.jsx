import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Lock, Eye, Volume2, Wifi, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [lightMode, setLightMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState('english');

  const sidebarItems = [
    { icon: SettingsIcon, label: "Settings", link: "/academic-ticket/studentdashboard", key: "dashboard" },
    { icon: User, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
  ];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log('Settings saved');
  };

  return (
    <div className={`flex h-screen ${lightMode ? "bg-white text-black" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className={`w-64 h-full p-6 flex flex-col ${lightMode ? "bg-gray-200" : "bg-gray-900 text-white"}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <SettingsIcon size={24} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-semibold">Settings</span>
            <p className="text-xs text-gray-400 mt-1">Manage your preferences</p>
          </div>
        </div>

        <nav className="flex-1">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSidebarClick(item)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 cursor-pointer transition-colors ${
                activeTab === item.key
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="flex items-center gap-3">
            <Sun
              onClick={() => setLightMode(true)}
              size={20}
              className={`cursor-pointer ${lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
            <Moon
              onClick={() => setLightMode(false)}
              size={20}
              className={`cursor-pointer ${!lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">SETTINGS</h1>
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </header>

        <main className="space-y-6">
          {/* General Settings */}
          <div className={`${lightMode ? "bg-white" : "bg-gray-800"} p-6 rounded-xl shadow`}>
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={20} />
                  <span>Language</span>
                </div>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`px-3 py-2 rounded-lg ${lightMode ? "bg-gray-100 text-black" : "bg-gray-700 text-white"}`}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette size={20} />
                  <span>Theme</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLightMode(!lightMode)}
                    className={`px-3 py-2 rounded-lg ${lightMode ? "bg-gray-200 text-black" : "bg-gray-700 text-white"}`}
                  >
                    {lightMode ? 'Light' : 'Dark'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className={`${lightMode ? "bg-white" : "bg-gray-800"} p-6 rounded-xl shadow`}>
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} />
                  <span>Push Notifications</span>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full transition-colors ${
                    notifications ? "bg-white" : "bg-gray-500"
                  } transform ${notifications ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User size={20} />
                  <span>Email Alerts</span>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    emailAlerts ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full transition-colors ${
                    emailAlerts ? "bg-white" : "bg-gray-500"
                  } transform ${emailAlerts ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className={`${lightMode ? "bg-white" : "bg-gray-800"} p-6 rounded-xl shadow`}>
            <h2 className="text-xl font-semibold mb-4">Security</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock size={20} />
                  <span>Two-Factor Authentication</span>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    twoFactor ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full transition-colors ${
                    twoFactor ? "bg-white" : "bg-gray-500"
                  } transform ${twoFactor ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye size={20} />
                  <span>Profile Visibility</span>
                </div>
                <select className={`px-3 py-2 rounded-lg ${lightMode ? "bg-gray-100 text-black" : "bg-gray-700 text-white"}`}>
                  <option>Public</option>
                  <option>Private</option>
                  <option>Friends Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className={`${lightMode ? "bg-white" : "bg-gray-800"} p-6 rounded-xl shadow`}>
            <h2 className="text-xl font-semibold mb-4">Advanced</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi size={20} />
                  <span>Data Usage</span>
                </div>
                <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  View Details
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 size={20} />
                  <span>Sound Effects</span>
                </div>
                <button
                  onClick={() => {}}
                  className={`w-12 h-6 rounded-full transition-colors bg-blue-600`}
                >
                  <div className="w-5 h-5 rounded-full bg-white transform translate-x-6" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
