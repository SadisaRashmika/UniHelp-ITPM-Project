import React, { useState, Fragment } from 'react';
import { Users, MessageSquare, Calendar, Trophy, Target, Clock, Plus, Search, X, Settings, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudyGroups = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('groups');
  const [lightMode, setLightMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const sidebarItems = [
    { icon: Users, label: "Study Groups", link: "/academic-ticket/studentdashboard", key: "dashboard" },
  ];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  const studyGroups = [
    {
      id: 1,
      name: "React Study Group",
      course: "CS302 - Web Development",
      description: "Collaborative learning for React hooks and state management",
      members: 12,
      maxMembers: 15,
      progress: 75,
      nextMeeting: "2026-04-05T18:00:00Z",
      creator: "Dr. John Smith",
      tags: ["React", "Frontend", "JavaScript"],
      difficulty: "Intermediate"
    },
    {
      id: 2,
      name: "Database Masters",
      course: "CS301 - Database Systems",
      description: "Advanced SQL and database design study group",
      members: 8,
      maxMembers: 10,
      progress: 90,
      nextMeeting: "2026-04-06T16:00:00Z",
      creator: "Dr. Sarah Johnson",
      tags: ["SQL", "Database", "PostgreSQL"],
      difficulty: "Advanced"
    },
    {
      id: 3,
      name: "Algorithm Practice",
      course: "CS201 - Data Structures",
      description: "Problem-solving and algorithm optimization practice",
      members: 15,
      maxMembers: 20,
      progress: 60,
      nextMeeting: "2026-04-07T17:00:00Z",
      creator: "Dr. Mike Chen",
      tags: ["Algorithms", "Problem Solving", "Python"],
      difficulty: "Beginner"
    },
    {
      id: 4,
      name: "Machine Learning Study",
      course: "CS401 - Artificial Intelligence",
      description: "Introduction to ML concepts and implementations",
      members: 10,
      maxMembers: 12,
      progress: 45,
      nextMeeting: "2026-04-08T19:00:00Z",
      creator: "Dr. Emily Davis",
      tags: ["Machine Learning", "Python", "TensorFlow"],
      difficulty: "Advanced"
    }
  ];

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleJoinGroup = (groupId) => {
    console.log('Joining group:', groupId);
    // Add join group logic here
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600';
      case 'Intermediate': return 'text-yellow-600';
      case 'Advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`flex h-screen ${lightMode ? "bg-white text-black" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className={`w-64 h-full p-6 flex flex-col ${lightMode ? "bg-gray-200" : "bg-gray-900 text-white"}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-semibold">Study Groups</span>
            <p className="text-xs text-gray-400 mt-1">Collaborative learning groups</p>
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
            <Settings
              onClick={() => setLightMode(!lightMode)}
              size={20}
              className={`cursor-pointer ${lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
            <button
              onClick={() => navigate('/academic-ticket/student-dashboard/settings')}
              className="p-2 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">STUDY GROUPS</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg ${
                  lightMode ? "bg-white text-black border-gray-300" : "bg-gray-800 text-white border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </header>

        <main className="space-y-6">
          {selectedGroup ? (
            /* Group Details View */
            <div className={`${lightMode ? "bg-white" : "bg-gray-800"} p-6 rounded-xl shadow`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedGroup.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedGroup.course}</p>
                  <p className="text-sm text-gray-500 mb-4">{selectedGroup.description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedGroup.difficulty)}`}>
                      {selectedGroup.difficulty}
                    </span>
                    <div className="flex gap-2">
                      {selectedGroup.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            /* Groups Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => handleGroupClick(group)}
                  className={`${lightMode ? "bg-white hover:bg-gray-50" : "bg-gray-800 hover:bg-gray-700"} p-6 rounded-xl shadow cursor-pointer transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{group.course}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{group.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(group.difficulty)}`}>
                      {group.difficulty}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Members:</span>
                      <span className="font-semibold">{group.members}/{group.maxMembers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress:</span>
                      <span className="font-semibold">{group.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Next:</span>
                      <span className="font-semibold">{new Date(group.nextMeeting).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {group.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Created by {group.creator}
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudyGroups;
