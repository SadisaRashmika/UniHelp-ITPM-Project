import React, { useState, useEffect } from "react";
import { ChartColumnBig, BookOpen, FileText, Briefcase, Users, Bell, Sun, Moon, User, Mail, Phone, Calendar, MapPin, Edit, Save, X, Camera, Award, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [lightMode, setLightMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Sidebar items
  const sidebarItems = [
    { icon: ChartColumnBig, label: "Profile", link: "/academic-ticket/studentdashboard", key: "dashboard" },
    { icon: BookOpen, label: "Tasks", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Submissions", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: Users, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  const [profileData, setProfileData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@university.edu",
    phone: "+94 77 123 4567",
    dateOfBirth: "2002-05-15",
    address: "123 Main Street, Colombo 04",
    bio: "Computer Science student passionate about web development and machine learning.",
    studentId: "CS2020123",
    year: "3rd Year",
    semester: "6th Semester",
    gpa: "3.75",
    department: "Computer Science",
    faculty: "Faculty of Computing",
    interests: ["Web Development", "Machine Learning", "UI/UX Design", "Mobile Apps"],
    skills: ["React", "Node.js", "Python", "JavaScript", "MongoDB", "MySQL"],
    achievements: [
      "Dean's List 2022",
      "Best Project Award - Web Dev Competition",
      "Google Developer Student Club Member"
    ]
  });

  const [tempProfileData, setTempProfileData] = useState({ ...profileData });

  const handleEdit = () => {
    setTempProfileData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData({ ...tempProfileData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfileData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-900  text-left">
      {/* Sidebar */}
      <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Pro</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-slate-900">Uni-Help System</span>
              <p className="text-xs text-slate-400 mt-0.5">Student Profile</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSidebarClick(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 cursor-pointer transition-all ${
                activeTab === item.key
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
              }`}
            >
              <item.icon size={17} className={activeTab === item.key ? "text-blue-500" : "text-slate-400"} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Student Profile</h1>
              <p className="text-slate-500 mt-2 text-lg">Manage your personal identity and academic record</p>
            </div>
            <div className="flex gap-4">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black hover:bg-slate-200 transition-all"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Profile Picture and Basic Info */}
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-sky-400 opacity-10" />
                <div className="relative z-10">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-sky-500 rounded-[40px] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-100 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl hover:bg-blue-600 transition-all shadow-xl">
                        <Camera size={18} />
                      </button>
                    )}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {isEditing ? (
                      <div className="flex gap-2 justify-center">
                        <input
                          type="text"
                          value={tempProfileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-24 text-center bg-slate-50 border-b-4 border-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          value={tempProfileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-24 text-center bg-slate-50 border-b-4 border-blue-500 outline-none"
                        />
                      </div>
                    ) : (
                      `${profileData.firstName} ${profileData.lastName}`
                    )}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{profileData.studentId}</p>
                  <div className="flex justify-center gap-3 mt-6">
                    <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                      {profileData.year}
                    </span>
                    <span className="px-4 py-2 bg-green-50 text-green-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                      {profileData.semester}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <User size={14} className="text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl mt-1">
                      <Mail size={16} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Email Address</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={tempProfileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-2 rounded-xl outline-none font-bold text-sm"
                        />
                      ) : (
                        <p className="text-slate-700 font-bold break-words">{profileData.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl mt-1">
                      <Phone size={16} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Phone Number</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={tempProfileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-2 rounded-xl outline-none font-bold text-sm"
                        />
                      ) : (
                        <p className="text-slate-700 font-bold">{profileData.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl mt-1">
                      <MapPin size={16} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Residential Address</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempProfileData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-2 rounded-xl outline-none font-bold text-sm"
                        />
                      ) : (
                        <p className="text-slate-700 font-bold leading-relaxed">{profileData.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Academic Information */}
            <div className="space-y-8">
              {/* Academic Details */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Award size={14} className="text-blue-600" />
                  Academic Standing
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 p-6 bg-blue-50 rounded-[32px] border border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Current GPA</p>
                    <p className="text-4xl font-black text-blue-700 tracking-tighter">{profileData.gpa}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Department</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempProfileData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-3 rounded-2xl outline-none font-bold text-sm"
                      />
                    ) : (
                      <p className="font-black text-slate-900">{profileData.department}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Faculty</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempProfileData.faculty}
                        onChange={(e) => handleInputChange('faculty', e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-3 rounded-2xl outline-none font-bold text-sm"
                      />
                    ) : (
                      <p className="font-black text-slate-900">{profileData.faculty}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Professional Bio</h3>
                {isEditing ? (
                  <textarea
                    value={tempProfileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl outline-none font-bold text-sm h-40 resize-none"
                  />
                ) : (
                  <p className="text-slate-700 font-medium leading-relaxed italic">"{profileData.bio}"</p>
                )}
              </div>

              {/* Achievements */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Target size={14} className="text-blue-600" />
                  Key Achievements
                </h3>
                <div className="space-y-3">
                  {profileData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-slate-700 font-bold text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Skills and Interests */}
            <div className="space-y-8">
              {/* Skills */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-100"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Academic Progress</h3>
                <div className="space-y-8">
                  <StatItem label="Overall Degree Completion" progress={75} color="blue" />
                  <StatItem label="Current Semester Load" progress={60} color="green" />
                  <StatItem label="Assignment Completion Rate" progress={85} color="purple" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, progress, color }) => {
  const colors = {
    blue: "bg-blue-600 shadow-blue-100",
    green: "bg-green-600 shadow-green-100",
    purple: "bg-purple-600 shadow-purple-100"
  };
  return (
    <div>
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-900">{progress}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div className={`${colors[color]} h-full rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default Profile;
