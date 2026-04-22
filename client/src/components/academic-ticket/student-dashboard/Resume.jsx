// src/pages/student-dashboard/Resume.jsx
import React, { useState } from "react";
import { Download, FileText, User, Mail, Phone, Briefcase, Award, BookOpen, Target, ChartColumnBig, Sun, Moon, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Resume = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    education: "",
    experience: "",
    projects: "",
    certificates: "",
    achievements: ""
  });

  const [activeTab, setActiveTab] = useState("resume");
  const [lightMode, setLightMode] = useState(false);
  const navigate = useNavigate();

  // Sidebar items
  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Quiz", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Practicals", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Award, label: "Grades", link: "/academic-ticket/student-dashboard/grades", key: "grades" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: User, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      skills: "",
      education: "",
      experience: "",
      projects: "",
      certificates: "",
      achievements: ""
    });
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-900  text-left">
      {/* Sidebar */}
      <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Res</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-slate-900">Uni-Help System</span>
              <p className="text-xs text-slate-400 mt-0.5">Resume Builder</p>
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
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Resume Builder</h1>
              <p className="text-slate-500 mt-2 text-lg">Create a professional resume tailored for tech roles</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
              <Download size={20} />
              Download Resume
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT - FORM */}
          <div className="space-y-6">
            {/* PERSONAL INFO */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Personal Information</h2>
              </div>
              <input type="text" name="name" placeholder="Full Name" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold" onChange={handleChange} />
              <input type="email" name="email" placeholder="Email Address" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold" onChange={handleChange} />
              <input type="text" name="phone" placeholder="Phone Number" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold" onChange={handleChange} />
            </div>

            {/* SECTIONS */}
            {[
              { id: 'education', icon: BookOpen, label: 'Education', placeholder: 'List your degrees and university' },
              { id: 'skills', icon: Target, label: 'Technical Skills', placeholder: 'React, Node.js, PostgreSQL, etc.' },
              { id: 'experience', icon: Briefcase, label: 'Work Experience', placeholder: 'Internships and professional roles' },
              { id: 'projects', icon: FileText, label: 'Key Projects', placeholder: 'Describe your best technical projects' },
              { id: 'certificates', icon: Award, label: 'Certifications', placeholder: 'Relevant professional certifications' },
              { id: 'achievements', icon: Award, label: 'Achievements', placeholder: 'Hackathons, awards, and recognitions' },
            ].map(section => (
              <div key={section.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <section.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">{section.label}</h2>
                </div>
                <textarea 
                  name={section.id} 
                  placeholder={section.placeholder} 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold h-32 resize-none" 
                  onChange={handleChange} 
                />
              </div>
            ))}

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button className="bg-slate-900 text-white px-8 py-5 rounded-3xl font-black hover:bg-slate-800 transition-all flex-1 shadow-lg shadow-slate-100">Save Progress</button>
              <button onClick={clearForm} className="bg-red-50 text-red-600 px-8 py-5 rounded-3xl font-black hover:bg-red-100 transition-all flex-1">Reset All</button>
            </div>
          </div>

          {/* RIGHT - PREVIEW */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200 sticky top-8 h-fit">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 rounded-xl">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest text-[10px]">Professional Preview</h2>
            </div>
            
            <div className="border-b border-slate-100 pb-8 mb-8">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{form.name || "Your Name"}</h3>
              <div className="flex flex-wrap items-center gap-6 mt-4 text-slate-400 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" />
                  <span>{form.email || "email@example.com"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-500" />
                  <span>{form.phone || "Phone Number"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {[
                { label: 'Education', value: form.education },
                { label: 'Technical Skills', value: form.skills },
                { label: 'Work Experience', value: form.experience },
                { label: 'Projects', value: form.projects },
                { label: 'Certifications', value: form.certificates },
                { label: 'Achievements', value: form.achievements },
              ].map(item => (
                <div key={item.label}>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</h3>
                  <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {item.value || `Your ${item.label.toLowerCase()} will appear here...`}
                  </p>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
