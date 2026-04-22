import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Users, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, Award, Play, Upload, Download, Eye, Settings, Bell, Search, Filter, Sun, Moon, ChevronRight, ChartColumnBig, Sun as SunIcon, Moon as MoonIcon, BarChart3, PieChart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const navigate = useNavigate();
  const [lightMode, setLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");

  // Sidebar items
  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/lec-dashboard/overview", key: "overview" },
    { icon: FileText, label: "Create Quiz", link: "/academic-ticket/lec-dashboard/quiz", key: "quiz" },
    { icon: Users, label: "Create Practical", link: "/academic-ticket/lec-dashboard/practical", key: "practical" },
    { icon: Upload, label: "Submissions", link: "/academic-ticket/lec-dashboard/submissions", key: "submissions" },
    { icon: TrendingUp, label: "Analytics", link: "/academic-ticket/lec-dashboard/analytics", key: "analytics" },
    { icon: Award, label: "Grades", link: "/academic-ticket/lec-dashboard/grades", key: "grades" },
  ];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  // Mock analytics data
  const courseStats = [
    { course: "CS301", name: "Database Management Systems", students: 0, avgGrade: 0, completionRate: 0 },
    { course: "CS302", name: "Web Development", students: 0, avgGrade: 0, completionRate: 0 },
    { course: "IT201", name: "IT Project Management", students: 0, avgGrade: 0, completionRate: 0 }
  ];

  const performanceTrends = [
    { month: "Jan", avgGrade: 0, submissions: 0 },
    { month: "Feb", avgGrade: 0, submissions: 0 },
    { month: "Mar", avgGrade: 0, submissions: 0 }
  ];

  const gradeDistribution = [
    { grade: "A", count: 0, percentage: 0 },
    { grade: "B", count: 0, percentage: 0 },
    { grade: "C", count: 0, percentage: 0 },
    { grade: "D", count: 0, percentage: 0 },
    { grade: "F", count: 0, percentage: 0 }
  ];

  const topPerformers = [];

  const atRiskStudents = [];

  return (
    <div className="flex h-screen bg-transparent text-slate-900 ">
      {/* Sidebar */}
      <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Ana</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-slate-900">Uni-Help System</span>
              <p className="text-xs text-slate-400 mt-0.5">Analytics Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSidebarClick(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 cursor-pointer transition-all text-left ${
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
        <div className="max-w-7xl mx-auto text-left">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Analytics Dashboard</h1>
            <p className="text-slate-500 mt-2 text-lg">Track student performance and course analytics</p>
          </div>

          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Students</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">140</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Average Grade</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">78.9%</p>
                </div>
                <div className="p-3 bg-green-50 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 border-l-4 border-l-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Completion Rate</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">91.7%</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Courses</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">3</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Course Performance */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6">Course Performance</h2>
              <div className="space-y-6">
                {courseStats.map((course) => (
                  <div key={course.course} className="border-l-4 border-blue-500 pl-6 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900">{course.name}</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{course.students} students enrolled</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900">{course.avgGrade}%</p>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{course.completionRate}% completion</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6">Grade Distribution</h2>
              <div className="space-y-4">
                {gradeDistribution.map((grade) => (
                  <div key={grade.grade} className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-black text-slate-900 w-12 text-sm uppercase"> {grade.grade}</span>
                      <div className="flex-1">
                        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${
                              grade.grade === 'A' ? 'bg-green-500' :
                              grade.grade === 'B' ? 'bg-blue-500' :
                              grade.grade === 'C' ? 'bg-yellow-500' :
                              grade.grade === 'D' ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${grade.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <span className="font-black text-slate-900">{grade.count}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase ml-2 tracking-widest">{grade.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Top Performers */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6">Top Performers</h2>
              <div className="space-y-4">
                {topPerformers.length === 0 ? (
                   <p className="text-slate-400 text-sm font-medium italic">No top performers data available</p>
                ) : topPerformers.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                        <span className="text-green-600 font-black text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{student.studentId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900">{student.avgGrade}%</p>
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{student.submissions} submissions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* At Risk Students */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6 text-red-600">Students At Risk</h2>
              <div className="space-y-4">
                {atRiskStudents.length === 0 ? (
                  <p className="text-slate-400 text-sm font-medium italic">No students currently at risk</p>
                ) : atRiskStudents.map((student) => (
                  <div key={student.studentId} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{student.studentId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-red-600">{student.avgGrade}%</p>
                      <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Last: {student.lastSubmission}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="mt-8 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 mb-6">Performance Trends</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {performanceTrends.map((trend) => (
                <div key={trend.month} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{trend.month}</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Avg Grade</p>
                      <p className="text-3xl font-black text-slate-900">{trend.avgGrade}%</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Submissions</p>
                      <p className="text-3xl font-black text-blue-600">{trend.submissions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
