import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Download, Edit, FileText, Award, Briefcase, GraduationCap, Calendar, Plus, Trash2 } from "lucide-react";

const ResumePage = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.id;

  // Fetch resume data from API
  const fetchResumeData = async () => {
    try {
      setLoading(true);
      // Use mock data for now to avoid API errors
      const mockResume = {
        personalInfo: {
          name: "Alex Johnson",
          email: "alex.johnson@university.edu",
          phone: "+1 234 567 8900",
          location: "San Francisco, CA",
          summary: "Computer Science student with passion for web development and data structures. Seeking internship opportunities to apply technical skills in real-world projects."
        },
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            school: "University of Technology",
            location: "San Francisco, CA",
            startDate: "2022-09-01",
            endDate: "2026-05-31",
            gpa: "3.75",
            coursework: ["Data Structures", "Algorithms", "Web Development", "Database Systems", "Software Engineering"]
          }
        ],
        experience: [
          {
            title: "Web Development Intern",
            company: "Tech Startup Inc.",
            location: "San Francisco, CA",
            startDate: "2024-01-15",
            endDate: "2024-05-15",
            description: "Developed responsive web applications using React and Node.js. Collaborated with team to implement new features and fix bugs."
          },
          {
            title: "Teaching Assistant",
            company: "University of Technology",
            location: "San Francisco, CA",
            startDate: "2023-09-01",
            endDate: "2023-12-15",
            description: "Assisted professor in teaching Data Structures and Algorithms to undergraduate students. Graded assignments and held office hours."
          }
        ],
        skills: [
          { name: "JavaScript", level: "Advanced", category: "Programming" },
          { name: "Python", level: "Intermediate", category: "Programming" },
          { name: "React", level: "Advanced", category: "Framework" },
          { name: "Node.js", level: "Intermediate", category: "Framework" },
          { name: "HTML/CSS", level: "Advanced", category: "Web" },
          { name: "SQL", level: "Intermediate", category: "Database" },
          { name: "Git", level: "Advanced", category: "Tool" },
          { name: "Figma", level: "Intermediate", category: "Design" }
        ],
        projects: [
          {
            title: "E-commerce Platform",
            description: "Full-stack e-commerce website with user authentication, payment processing, and inventory management.",
            technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
            link: "https://github.com/alexjohnson/ecommerce",
            github: "https://github.com/alexjohnson/ecommerce"
          },
          {
            title: "Task Management App",
            description: "React-based task management application with drag-and-drop functionality and real-time updates.",
            technologies: ["React", "Firebase", "Tailwind CSS"],
            link: "https://taskapp-demo.vercel.app",
            github: "https://github.com/alexjohnson/taskapp"
          }
        ],
        certifications: [
          {
            name: "React Developer Certification",
            issuer: "Meta",
            date: "2024-02-15",
            credentialId: "REACT-2024-12345"
          },
          {
            name: "AWS Cloud Practitioner",
            issuer: "Amazon Web Services",
            date: "2023-11-20",
            credentialId: "AWS-CP-2023-67890"
          }
        ]
      };

      setResume(mockResume);
    } catch (error) {
      console.error('Error fetching resume data:', error);
      setError('Error loading resume data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch resume data on component mount
  useEffect(() => {
    fetchResumeData();
  }, [studentId]);

  const handleDownload = () => {
    // Mock download functionality
    const resumeText = `
${resume?.personalInfo?.name || ''}
${resume?.personalInfo?.email || ''} | ${resume?.personalInfo?.phone || ''} | ${resume?.personalInfo?.location || ''}

SUMMARY
${resume?.personalInfo?.summary || ''}

EDUCATION
${resume?.education?.map(edu => `${edu.degree} - ${edu.school}
${edu.location} | ${edu.startDate} - ${edu.endDate}
GPA: ${edu.gpa}`).join('\n\n') || ''}

EXPERIENCE
${resume?.experience?.map(exp => `${exp.title} - ${exp.company}
${exp.location} | ${exp.startDate} - ${exp.endDate}
${exp.description}`).join('\n\n') || ''}

SKILLS
${resume?.skills?.map(skill => `${skill.name} (${skill.level})`).join(', ') || ''}

PROJECTS
${resume?.projects?.map(proj => `${proj.title}
${proj.description}
Technologies: ${proj.technologies.join(', ')}`).join('\n\n') || ''}

CERTIFICATIONS
${resume?.certifications?.map(cert => `${cert.name} - ${cert.issuer}
${cert.date}`).join('\n\n') || ''}
    `;

    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume?.personalInfo?.name || 'resume'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-500">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-500">Error loading resume</p>
          <button 
            onClick={fetchResumeData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No resume data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resume</h1>
            <p className="text-sm text-gray-500 mt-1">Your professional profile and achievements</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <User className="w-8 h-8 text-blue-500" />
                Personal Information
              </h2>
              {isEditing && (
                <button className="text-blue-600 hover:text-blue-700">
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={resume.personalInfo.name}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={resume.personalInfo.email}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={resume.personalInfo.phone}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={resume.personalInfo.location}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
              <textarea
                value={resume.personalInfo.summary}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Award className="w-8 h-8 text-purple-500" />
                Skills
              </h2>
              {isEditing && (
                <button className="text-blue-600 hover:text-blue-700">
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {resume.skills.map((skill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{skill.name}</h3>
                    {isEditing && (
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Level:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      skill.level === 'Advanced' ? 'bg-green-100 text-green-800' :
                      skill.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{skill.category}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-green-500" />
                Experience
              </h2>
              {isEditing && (
                <button className="text-blue-600 hover:text-blue-700">
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {resume.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    {isEditing && (
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.startDate} - {exp.endDate}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-blue-500" />
                Education
              </h2>
              {isEditing && (
                <button className="text-blue-600 hover:text-blue-700">
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {resume.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-purple-600 font-medium">{edu.school}</p>
                    </div>
                    {isEditing && (
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>GPA: {edu.gpa}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Relevant Coursework:</strong> {edu.coursework.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumePage;
