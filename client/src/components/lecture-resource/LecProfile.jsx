import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Clock, Upload, Trophy, ArrowRight } from 'lucide-react';

const LEVEL_MAP = [
  { min: 0, label: 'Bronze', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { min: 300, label: 'Silver', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { min: 600, label: 'Gold', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { min: 1000, label: 'Platinum', color: 'bg-blue-100 text-blue-700 border-blue-200' },
];

const getLevel = (pts) => [...LEVEL_MAP].reverse().find(l => pts >= l.min) || LEVEL_MAP[0];

const getInitials = (lecturer) => {
  if (lecturer?.initials) return lecturer.initials;
  const parts = (lecturer?.name || '').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase() || 'L';
};

const LecProfile = ({ lecturerId, pendingCount, onNavigate }) => {
  const [lecturer, setLecturer] = useState(null);
  const [stats, setStats] = useState({
    downloads: 0,
    uploadedResources: 0,
  });
  const [myPoints, setMyPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch lecturer data and stats from the backend
  useEffect(() => {
    const fetchLecturerData = async () => {
      try {
        const profileResponse = await axios.get(`http://localhost:5000/api/lecturer/profile?lecturerId=${lecturerId}`);
        setLecturer(profileResponse.data);

        const statsResponse = await axios.get(`http://localhost:5000/api/lecturer/stats?lecturerId=${lecturerId}`);
        setStats(statsResponse.data);

        setMyPoints(profileResponse.data.points);
      } catch (error) {
        console.error('Error fetching lecturer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturerData();
  }, [lecturerId]);

  if (loading) return <div>Loading...</div>; // Show loading state

  const level = getLevel(myPoints);

  return (
    <div className="space-y-6 w-full">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lecturer Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your profile and view your statistics</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {getInitials(lecturer)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{lecturer.name}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{lecturer.department}</p>
            <div className="mt-3 grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-400">Employee ID</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{lecturer.employee_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Department</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{lecturer.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{lecturer.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<Download size={22} className="text-blue-400" />}
          iconBg="bg-blue-50"
          label="Downloads"
          value={stats.downloads}
        />
        <StatCard
          icon={<Clock size={22} className="text-yellow-500" />}
          iconBg="bg-yellow-50"
          label="Pending Reviews"
          value={pendingCount}
        />
        <StatCard
          icon={<Upload size={22} className="text-green-500" />}
          iconBg="bg-green-50"
          label="Uploaded Resources"
          value={stats.uploadedResources}
        />
        <StatCard
          icon={<Trophy size={22} className="text-purple-500" />}
          iconBg="bg-purple-50"
          label="My Points"
          value={myPoints}
        />
      </div>

      {/* Performance level */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Performance Level</h3>
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Your current level based on review points</p>
            <p className="text-sm font-medium text-gray-700">Checking student resources earns you points for bonus salary</p>
          </div>
          <div className={`px-5 py-2.5 rounded-xl border font-bold text-base ${level.color}`}>
            {level.label}
          </div>
        </div>

        {/* Level thresholds */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {LEVEL_MAP.map((l) => (
            <div key={l.label} className={`rounded-xl px-4 py-3 border text-center ${myPoints >= l.min ? l.color : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
              <p className="font-bold text-sm">{l.label}</p>
              <p className="text-xs mt-0.5 opacity-70">{l.min}+ pts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 gap-4">
        <QuickNav
          title="Check Student Uploads"
          desc={`${pendingCount} submissions waiting`}
          cta="Review Now"
          onClick={() => onNavigate('review')}
          accent="border-blue-100 hover:border-blue-200"
          ctaColor="text-blue-600"
        />
        <QuickNav
          title="Upload Resources & Quiz"
          desc="Add new lecture materials"
          cta="Go to Upload"
          onClick={() => onNavigate('upload')}
          accent="border-green-100 hover:border-green-200"
          ctaColor="text-green-600"
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, iconBg, label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-5">
    <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <p className="text-xs text-gray-400 font-medium">{label}</p>
    <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
  </div>
);

const QuickNav = ({ title, desc, cta, onClick, accent, ctaColor }) => (
  <button
    onClick={onClick}
    className={`bg-white rounded-2xl border p-5 text-left hover:shadow-sm transition-all group ${accent}`}
  >
    <p className="font-semibold text-gray-900">{title}</p>
    <p className="text-sm text-gray-400 mt-1 mb-3">{desc}</p>
    <div className={`flex items-center gap-1.5 text-sm font-semibold ${ctaColor}`}>
      {cta} <ArrowRight size={14} />
    </div>
  </button>
);

export default LecProfile;