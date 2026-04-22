import React, { useState } from "react";
import { BookOpen, Award, TrendingUp, Calendar, Download, Filter, Search, ChevronDown, X, FileText, BarChart3, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AcademicRecords = () => {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState("all"); // Student-specific semester filter
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const academicData = {
    currentGPA: 3.75,
    totalCredits: 45,
    completedCourses: 15,
    ongoingCourses: 6,
    academicStanding: "Good Standing"
  };

  const semesters = [
    { id: "fall2025", name: "Fall 2025", active: true },
    { id: "spring2025", name: "Spring 2025", active: false },
    { id: "fall2024", name: "Fall 2024", active: false },
    { id: "spring2024", name: "Spring 2024", active: false }
  ];

  const courses = [
    {
      id: 1,
      code: "CS301",
      name: "Database Management Systems",
      credits: 3,
      grade: "A",
      gradePoints: 4.0,
      semester: "fall2025",
      status: "completed",
      instructor: "Prof. John Smith",
      type: "Core"
    },
    {
      id: 2,
      code: "CS302",
      name: "Web Development",
      credits: 4,
      grade: "A",
      gradePoints: 4.0,
      semester: "fall2025",
      status: "completed",
      instructor: "Prof. Sarah Johnson",
      type: "Core"
    },
    {
      id: 3,
      code: "CS303",
      name: "Algorithms & Data Structures",
      credits: 3,
      grade: "B+",
      gradePoints: 3.3,
      semester: "fall2025",
      status: "completed",
      instructor: "Prof. Michael Brown",
      type: "Core"
    },
    {
      id: 4,
      code: "CS304",
      name: "Operating Systems",
      credits: 3,
      grade: "A-",
      gradePoints: 3.7,
      semester: "fall2025",
      status: "completed",
      instructor: "Prof. Emily Davis",
      type: "Core"
    },
    {
      id: 5,
      code: "CS305",
      name: "Computer Networks",
      credits: 3,
      grade: "A",
      gradePoints: 4.0,
      semester: "fall2025",
      status: "completed",
      instructor: "Prof. David Wilson",
      type: "Core"
    },
    {
      id: 6,
      code: "CS306",
      name: "Software Engineering",
      credits: 3,
      grade: "A-",
      gradePoints: 3.7,
      semester: "fall2025",
      status: "completed",
      instructor: "Prof. Lisa Anderson",
      type: "Core"
    }
  ];

  const getGradeColor = (grade) => {
    if (grade === "A" || grade === "A-") return "text-green-600 bg-green-100";
    if (grade === "B+" || grade === "B") return "text-blue-600 bg-blue-100";
    if (grade === "B-" || grade === "C+") return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const filteredCourses = courses.filter(course => {
    const matchesSemester = selectedSemester === "all" || course.semester === selectedSemester;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSemester && matchesSearch;
  });

  const calculateSemesterGPA = (semesterCourses) => {
    const totalPoints = semesterCourses.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0);
    const totalCredits = semesterCourses.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Academic Records</h1>
            <p className="text-gray-600 mt-1">View your grades and academic performance</p>
          </div>
          <button
            onClick={() => navigate('/academic-ticket/studentdashboard')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Academic Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="text-blue-600" size={24} />
              <span className="text-sm text-gray-500">Current</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{academicData.currentGPA}</h3>
            <p className="text-sm text-gray-600">GPA</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="text-green-600" size={24} />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{academicData.totalCredits}</h3>
            <p className="text-sm text-gray-600">Credits</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="text-purple-600" size={24} />
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{academicData.completedCourses}</h3>
            <p className="text-sm text-gray-600">Courses</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="text-orange-600" size={24} />
              <span className="text-sm text-gray-500">Status</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{academicData.academicStanding}</h3>
            <p className="text-sm text-gray-600">Standing</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Semester Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter size={16} />
                  {selectedSemester === "all" ? "All Semesters" : semesters.find(s => s.id === selectedSemester)?.name}
                  <ChevronDown size={16} />
                </button>
                
                {showFilters && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {semesters.map(semester => (
                      <button
                        key={semester.id}
                        onClick={() => {
                          setSelectedSemester(semester.id);
                          setShowFilters(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {semester.name}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedSemester("all");
                        setShowFilters(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-t last:rounded-b-lg"
                    >
                      All Semesters
                    </button>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={16} />
              Export Transcript
            </button>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{course.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{course.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.credits}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.gradePoints}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{course.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {course.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Semester GPA Summary */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Semester GPA Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {semesters.map(semester => {
              const semesterCourses = courses.filter(c => c.semester === semester.id);
              const gpa = calculateSemesterGPA(semesterCourses);
              return (
                <div key={semester.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{semester.name}</h4>
                    {semester.active && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Current</span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{gpa}</div>
                  <div className="text-sm text-gray-600">GPA • {semesterCourses.length} courses</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicRecords;
