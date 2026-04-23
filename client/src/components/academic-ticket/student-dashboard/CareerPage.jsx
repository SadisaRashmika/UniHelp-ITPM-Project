import React, { useState, useEffect } from "react";
import { Briefcase, MapPin, Clock, DollarSign, TrendingUp, Building, Users, Calendar, ExternalLink, ChartColumnBig, BookOpen, FileText, Trophy, Award, Target, Star, Activity, Brain, GraduationCap, Settings, Sun, Moon, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CareerPage = () => {
  const [activeTab, setActiveTab] = useState("career");
  const [lightMode, setLightMode] = useState(false);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Internship application form state
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    graduationYear: '',
    gpa: '',
    internshipType: '',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    coverLetter: '',
    skills: '',
    resume: null
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form handling functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      // Here you would upload to server
      setTimeout(() => {
        setApplicationData(prev => ({
          ...prev,
          resume: file
        }));
        setUploading(false);
      }, 1000);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const studentId = user.id;
      
      // Prepare form data for API submission
      const formData = new FormData();
      formData.append('studentId', studentId);
      formData.append('fullName', applicationData.fullName);
      formData.append('email', applicationData.email);
      formData.append('phone', applicationData.phone);
      formData.append('university', applicationData.university);
      formData.append('major', applicationData.major);
      formData.append('graduationYear', applicationData.graduationYear);
      formData.append('gpa', applicationData.gpa);
      formData.append('internshipType', applicationData.internshipType);
      formData.append('company', applicationData.company);
      formData.append('position', applicationData.position);
      formData.append('startDate', applicationData.startDate);
      formData.append('endDate', applicationData.endDate);
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('skills', applicationData.skills);
      
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume);
      }

      // API call to submit application
      const response = await fetch('/api/academic-ticket/internship-applications', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        setShowApplicationForm(false);
        setApplicationData({
          fullName: '',
          email: '',
          phone: '',
          university: '',
          major: '',
          graduationYear: '',
          gpa: '',
          internshipType: '',
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          coverLetter: '',
          skills: '',
          resume: null
        });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.id;

  // Fetch career data from API
  const fetchCareerData = async () => {
    try {
      setLoading(true);
      // Use mock data for now to avoid API errors
      const mockJobs = [
        {
          id: 1,
          title: "Frontend Developer Intern",
          company: "Tech Solutions Inc.",
          location: "San Francisco, CA",
          type: "Internship",
          salary: "$25-30/hr",
          posted: "2024-04-01",
          deadline: "2024-04-15",
          description: "Looking for motivated frontend developer intern with React experience.",
          requirements: ["React", "JavaScript", "CSS", "HTML"],
          status: "active"
        },
        {
          id: 2,
          title: "Junior Software Developer",
          company: "Digital Innovations",
          location: "New York, NY",
          type: "Full-time",
          salary: "$60,000-75,000",
          posted: "2024-03-28",
          deadline: "2024-04-20",
          description: "Entry-level position for recent CS graduates.",
          requirements: ["JavaScript", "Python", "SQL", "Git"],
          status: "active"
        },
        {
          id: 3,
          title: "Web Developer Co-op",
          company: "StartUp Hub",
          location: "Remote",
          type: "Co-op",
          salary: "$20-25/hr",
          posted: "2024-03-25",
          deadline: "2024-04-10",
          description: "Remote co-op position for web development students.",
          requirements: ["HTML", "CSS", "JavaScript", "React"],
          status: "closing_soon"
        }
      ];

      const mockInternships = [
        {
          id: 1,
          title: "Software Engineering Intern",
          company: "Google",
          location: "Mountain View, CA",
          duration: "12 weeks",
          stipend: "$8,000",
          posted: "2024-03-20",
          deadline: "2024-04-05",
          description: "Summer internship program for CS students.",
          requirements: ["Python", "Java", "Data Structures", "Algorithms"],
          status: "active"
        },
        {
          id: 2,
          title: "Data Science Intern",
          company: "Microsoft",
          location: "Redmond, WA",
          duration: "10 weeks",
          stipend: "$7,500",
          posted: "2024-03-18",
          deadline: "2024-04-08",
          description: "Work with real-world data science projects.",
          requirements: ["Python", "Machine Learning", "Statistics", "SQL"],
          status: "active"
        }
      ];

      setJobs(mockJobs);
      setInternships(mockInternships);
    } catch (error) {
      console.error('Error fetching career data:', error);
      setError('Error loading career data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch career data on component mount
  useEffect(() => {
    fetchCareerData();
  }, [studentId]);

  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Tasks", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Submissions", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: Users, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  const bottomItems = [{ icon: Settings, label: "Settings", link: "/academic-ticket/student-dashboard/settings", key: "settings" }];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    if (item.link) navigate(item.link);
  };

  const handleAcademicRecordsClick = () => {
    navigate('/academic-ticket/student-dashboard/academic-records');
  };

  const handleEditProfileClick = () => {
    navigate('/academic-ticket/student-dashboard/edit-profile');
  };

  const handleEventsClick = () => {
    navigate('/academic-ticket/student-dashboard/events');
  };

  const handleAnnouncementsClick = () => {
    navigate('/academic-ticket/student-dashboard/announcements');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closing_soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`flex h-screen ${lightMode ? "bg-white text-black" : "bg-gray-100 text-gray-900"}`}>
      {/* Header Sidebar */}
      <div className={`w-72 h-screen flex flex-col overflow-y-auto ${lightMode ? "bg-gray-800" : "bg-gray-900 text-white"}`}>
        {/* Logo and Brand */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎓</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">UniHelp</h1>
              <p className="text-xs text-gray-400">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Static Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {sidebarItems.map((item, i) => (
              <div
                key={i}
                onClick={() => handleSidebarClick(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  activeTab === item.key
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-700">
            <h3 className="text-xs uppercase text-gray-400 mb-3 font-semibold">Quick Access</h3>
            <div className="space-y-1">
              <div
                onClick={handleAcademicRecordsClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-700 text-white"
              >
                <FileText size={20} />
                <span className="font-medium">Academic Records</span>
              </div>
              <div
                onClick={handleEventsClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-700 text-white"
              >
                <Calendar size={20} />
                <span className="font-medium">Events</span>
              </div>
              <div
                onClick={handleAnnouncementsClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-700 text-white"
              >
                <Bell size={20} />
                <span className="font-medium">Announcements</span>
              </div>
            </div>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              AJ
            </div>
            <div>
              <p className="text-sm font-medium text-white">Alex Johnson</p>
              <p className="text-xs text-gray-400">Student ID: 2024001</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-4 py-2">
              <Sun
                onClick={() => setLightMode(true)}
                size={16}
                className={`cursor-pointer ${lightMode ? "text-yellow-500" : "text-gray-400"}`}
              />
              <Moon
                onClick={() => setLightMode(false)}
                size={16}
                className={`cursor-pointer ${!lightMode ? "text-yellow-500" : "text-gray-400"}`}
              />
              <span className="text-xs text-gray-400">Theme</span>
            </div>
            {bottomItems.map((item, i) => (
              <div
                key={i}
                onClick={() => handleSidebarClick(item)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 text-white transition-colors"
              >
                <item.icon size={16} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Career Opportunities</h1>
              <p className="text-sm text-gray-500 mt-1">Explore jobs and internships for students</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
                <p className="text-xs text-gray-500">Computer Science</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                AJ
              </div>
            </div>
          </div>
        </header>

      <main className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-500">Loading career opportunities...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-gray-500">Error loading career data</p>
              <button 
                onClick={fetchCareerData}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Jobs</p>
                    <p className="text-3xl font-bold mt-1">{jobs.length}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Briefcase className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Internships</p>
                    <p className="text-3xl font-bold mt-1">{internships.length}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Building className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">New This Week</p>
                    <p className="text-3xl font-bold mt-1">5</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Section */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-500" />
                  Job Opportunities
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {jobs.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No job opportunities available</p>
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <p className="text-blue-600 font-medium">{job.company}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(job.status)}`}>
                            {job.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{job.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">Deadline: {job.deadline}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{job.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Posted: {job.posted}
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            Apply Now
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Internships Section */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="w-6 h-6 text-green-500" />
                  Internship Programs
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {internships.length === 0 ? (
                    <div className="text-center py-8">
                      <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No internships available</p>
                    </div>
                  ) : (
                    internships.map((internship) => (
                      <div key={internship.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                            <p className="text-green-600 font-medium">{internship.company}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(internship.status)}`}>
                            {internship.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{internship.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{internship.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{internship.stipend}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">Deadline: {internship.deadline}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{internship.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                          <div className="flex flex-wrap gap-2">
                            {internship.requirements.map((req, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Posted: {internship.posted}
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                            Apply Now
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Internship Application Form Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto m-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Internship Application</h2>
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmitApplication} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={applicationData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={applicationData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john.doe@university.edu"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={applicationData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                      <input
                        type="text"
                        name="university"
                        value={applicationData.university}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="University Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Major *</label>
                      <input
                        type="text"
                        name="major"
                        value={applicationData.major}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Computer Science"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year *</label>
                      <input
                        type="text"
                        name="graduationYear"
                        value={applicationData.graduationYear}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2024"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GPA *</label>
                      <input
                        type="text"
                        name="gpa"
                        value={applicationData.gpa}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="3.8"
                      />
                    </div>
                  </div>

                  {/* Internship Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Internship Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Internship Type *</label>
                      <select
                        name="internshipType"
                        value={applicationData.internshipType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="summer">Summer Internship</option>
                        <option value="fall">Fall Internship</option>
                        <option value="spring">Spring Internship</option>
                        <option value="co-op">Co-op Program</option>
                        <option value="part-time">Part-time</option>
                        <option value="full-time">Full-time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Company *</label>
                      <input
                        type="text"
                        name="company"
                        value={applicationData.company}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Company Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                      <input
                        type="text"
                        name="position"
                        value={applicationData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Software Developer Intern"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                        <input
                          type="date"
                          name="startDate"
                          value={applicationData.startDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                        <input
                          type="date"
                          name="endDate"
                          value={applicationData.endDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills *</label>
                    <textarea
                      name="skills"
                      value={applicationData.skills}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="React, JavaScript, Python, SQL, Git..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                    <textarea
                      name="coverLetter"
                      value={applicationData.coverLetter}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us why you're interested in this internship..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="flex items-center justify-center cursor-pointer hover:bg-gray-50"
                      >
                        <FileText className="w-6 h-6 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {applicationData.resume ? applicationData.resume.name : 'Choose Resume File'}
                        </span>
                      </label>
                      {uploading && (
                        <div className="mt-2 text-center">
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !applicationData.resume}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setShowApplicationForm(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 z-40"
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">Apply for Internship</span>
        </button>
      </main>
      </div>
    </div>
  );
};

export default CareerPage;
