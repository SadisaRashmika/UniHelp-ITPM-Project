import React, { useState, useEffect } from "react";
import { 
  ChartColumnBig, Users, Settings, Sun, Moon, Bell, BookOpen, 
  FileText, Briefcase, Award, X, Upload, CheckCircle, Loader2,
  MapPin, DollarSign, Search, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Career = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [activeTab, setActiveTab] = useState("career");
  const [lightMode, setLightMode] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);

  const navigate = useNavigate();

  // Sidebar items
  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Quiz", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Practicals", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Award, label: "Grades", link: "/academic-ticket/student-dashboard/grades", key: "grades" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: Users, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  useEffect(() => {
    setJobs([
      { id: 1, title: "Frontend Intern", company: "ABC Tech", type: "internship", location: "Colombo", salary: "$500/month" },
      { id: 2, title: "Backend Developer", company: "XYZ Solutions", type: "fulltime", location: "Remote", salary: "$1200/month" },
      { id: 3, title: "UI Designer", company: "Creative Studio", type: "internship", location: "Kandy", salary: "$400/month" },
      { id: 4, title: "Software Engineer", company: "Tech Corp", type: "fulltime", location: "Galle", salary: "$1500/month" },
      { id: 5, title: "Data Analyst", company: "Data Solutions", type: "fulltime", location: "Colombo", salary: "$1300/month" },
      { id: 6, title: "React Developer", company: "Frontend Labs", type: "internship", location: "Remote", salary: "$450/month" },
      { id: 7, title: "Node.js Developer", company: "Backend Hub", type: "fulltime", location: "Colombo", salary: "$1400/month" },
      { id: 8, title: "DevOps Engineer", company: "Cloud Tech", type: "fulltime", location: "Remote", salary: "$1600/month" }
    ]);
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || job.type === filter)
  );

  const handleApplyJob = (job) => {
    setSelectedJob(job);
    setShowApplyDialog(true);
  };

  const handleConfirmApply = async (formData) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      data.append('studentId', 'STU001'); // Mock student ID
      
      const response = await axios.post("http://localhost:5000/api/internship-applications", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert("Application submitted successfully!");
        setShowApplyDialog(false);
        setSelectedJob(null);
      }
    } catch (error) {
      console.error("Application failed:", error);
      alert("Error submitting application. Please try again.");
    }
  };

  const handleCancelApply = () => {
    setShowApplyDialog(false);
    setSelectedJob(null);
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-900  text-left">
      {/* Sidebar */}
      <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Job</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-slate-900">Uni-Help System</span>
              <p className="text-xs text-slate-400 mt-0.5">Career Planning</p>
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

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 space-y-10 overflow-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Career Planning</h1>
          <p className="text-slate-500 mt-2 text-lg">Explore jobs, internships, and essential professional skills</p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                className="pl-12 pr-10 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold cursor-pointer appearance-none min-w-[200px]"
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="internship">Internships</option>
                <option value="fulltime">Full Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Total Jobs" value={jobs.length} color="blue" icon={Briefcase} />
          <Card title="Internships" value={jobs.filter(j => j.type === "internship").length} color="green" icon={Award} />
          <Card title="Full Time" value={jobs.filter(j => j.type === "fulltime").length} color="orange" icon={Users} />
        </div>

        {/* JOB CARDS */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                  <Briefcase className="text-blue-600" size={32} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full text-slate-400">
                  {job.type}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{job.title}</h3>
              <p className="text-slate-500 font-bold mb-6">{job.company}</p>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-black text-slate-400 uppercase tracking-widest mb-8">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-300" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-slate-300" />
                  {job.salary}
                </div>
              </div>

              <button 
                onClick={() => handleApplyJob(job)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-100"
              >
                Apply for Position
              </button>
            </div>
          ))}
        </div>

        {/* RECOMMENDED SKILLS */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-8">🧠 Recommended Skills</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <SkillItem label="React Development" progress={80} color="blue" />
            <SkillItem label="Node.js Backend" progress={60} color="green" />
            <SkillItem label="Database Design" progress={50} color="orange" />
            <SkillItem label="System Design Basics" progress={40} color="red" />
          </div>
        </div>

        {/* CAREER PROGRESS + SMART SUGGESTIONS */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-8">📊 Career Progress</h2>
            <div className="space-y-6">
              <SkillItem label="Frontend Proficiency" progress={60} color="blue" subtext="3 of 5 projects completed" />
              <SkillItem label="Backend Proficiency" progress={40} color="green" subtext="2 of 5 modules mastered" />
              <SkillItem label="Soft Skills" progress={66} color="purple" subtext="4 of 6 certifications earned" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-8">🤖 Smart AI Suggestions</h2>
            <div className="space-y-4">
              <SuggestionItem text="Based on your skills, try Frontend Developer roles" color="blue" />
              <SuggestionItem text="Improve Node.js for Backend opportunities" color="green" />
              <SuggestionItem text="Learn Cloud Deployment for DevOps roles" color="orange" />
              <SuggestionItem text="UI/UX Design for better portfolio" color="purple" />
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-8">📌 Recent Career Activity</h2>
          <div className="space-y-4">
            <ActivityLog text="Applied for Frontend Internship" time="2 days ago" />
            <ActivityLog text="Completed React Course" time="1 week ago" />
            <ActivityLog text="Updated Professional Resume" time="3 days ago" />
            <ActivityLog text="Participated in University Hackathon" time="5 days ago" />
          </div>
        </div>

      </div>

      {/* APPLY DIALOG */}
      {showApplyDialog && selectedJob && (
        <InternshipForm 
          job={selectedJob} 
          onClose={handleCancelApply} 
          onSubmit={handleConfirmApply} 
        />
      )}
    </div>
  );
};

const Card = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100"
  };
  return (
    <div className={`p-6 rounded-[32px] border ${colors[color]} shadow-sm text-left`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{title}</p>
          <p className="text-3xl font-black">{value}</p>
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-sm">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

const SkillItem = ({ label, progress, color, subtext }) => {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    orange: "bg-orange-600",
    purple: "bg-purple-600",
    red: "bg-red-600"
  };
  return (
    <div>
      <div className="flex justify-between mb-2 items-baseline">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="font-black text-slate-900 text-sm">{progress}%</span>
      </div>
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
        <div className={`${colors[color]} h-full rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }} />
      </div>
      {subtext && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{subtext}</p>}
    </div>
  );
};

const SuggestionItem = ({ text, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100"
  };
  return (
    <div className={`${colors[color]} p-4 rounded-2xl border font-bold text-sm flex items-center gap-3`}>
      <div className="w-2 h-2 rounded-full bg-current opacity-40 shrink-0" />
      {text}
    </div>
  );
};

const ActivityLog = ({ text, time }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200" />
      <span className="font-bold text-slate-700 text-sm">{text}</span>
    </div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
  </div>
);

const InternshipForm = ({ job, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Alex Student", // Pre-filled mock data
    email: "alex@university.com",
    phone: "",
    university: "SLIIT",
    major: "Software Engineering",
    graduationYear: "2026",
    gpa: "3.8",
    internshipType: job.type,
    company: job.company,
    position: job.title,
    startDate: "",
    endDate: "",
    coverLetter: "",
    skills: "React, Node.js, SQL",
    resume: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[48px] shadow-2xl max-w-4xl w-full my-8 relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-all text-slate-400">
          <X size={24} />
        </button>

        <form onSubmit={handleSubmit} className="p-12 space-y-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2 block">Application Form</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Apply for {job.title}</h2>
            <p className="text-slate-500 font-bold mt-1">at {job.company}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users size={20} className="text-blue-600" /> Personal Info
              </h3>
              <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <Input label="Phone" name="phone" placeholder="+94 7X XXX XXXX" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Award size={20} className="text-blue-600" /> Academic Info
              </h3>
              <Input label="University" name="university" value={formData.university} onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Graduation Year" name="graduationYear" type="number" value={formData.graduationYear} onChange={handleChange} required />
                <Input label="GPA" name="gpa" type="number" step="0.01" value={formData.gpa} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-100">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600" /> Internship Details
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internship Type</label>
                <select 
                  name="internshipType"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none"
                  value={formData.internshipType}
                  onChange={handleChange}
                >
                  <option value="internship">Internship</option>
                  <option value="fulltime">Full Time</option>
                  <option value="parttime">Part Time</option>
                </select>
              </div>
              <Input label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
              <Input label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" /> Professional Details
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Letter (Optional)</label>
              <textarea 
                name="coverLetter"
                className="w-full h-32 px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-3xl outline-none font-medium text-slate-600 transition-all resize-none"
                placeholder="Why are you a good fit for this role?"
                value={formData.coverLetter}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <Input label="Skills (Comma separated)" name="skills" value={formData.skills} onChange={handleChange} required />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Resume (PDF/DOC)</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    name="resume"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-blue-500 rounded-2xl transition-all">
                    <Upload size={20} className="text-slate-400 group-hover:text-blue-600" />
                    <span className="font-bold text-slate-500 truncate">
                      {formData.resume ? formData.resume.name : "Choose file..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 pt-10 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 py-5 text-slate-400 font-bold hover:text-slate-600 transition-all">
              Cancel Application
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] py-5 bg-slate-900 text-white rounded-[24px] font-black hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 text-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={24} />}
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all"
      {...props} 
    />
  </div>
);

export default Career;
