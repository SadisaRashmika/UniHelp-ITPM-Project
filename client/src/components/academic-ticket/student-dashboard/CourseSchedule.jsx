import React, { useState } from "react";
import { Calendar, Clock, MapPin, User, BookOpen, Filter, Search, ChevronLeft, ChevronRight, X, Bell, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseSchedule = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedView, setSelectedView] = useState("week"); // week, month, list
  const [searchTerm, setSearchTerm] = useState("");

  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const courses = [
    {
      id: 1,
      code: "CS301",
      name: "Database Management Systems",
      instructor: "Prof. John Smith",
      room: "CS-201",
      credits: 3,
      color: "blue",
      schedule: [
        { day: "Monday", time: "9:00 AM", duration: 60 },
        { day: "Wednesday", time: "9:00 AM", duration: 60 },
        { day: "Friday", time: "9:00 AM", duration: 60 }
      ]
    },
    {
      id: 2,
      code: "CS302",
      name: "Web Development",
      instructor: "Prof. Sarah Johnson",
      room: "CS-305",
      credits: 4,
      color: "green",
      schedule: [
        { day: "Tuesday", time: "2:00 PM", duration: 90 },
        { day: "Thursday", time: "2:00 PM", duration: 90 }
      ]
    },
    {
      id: 3,
      code: "CS303",
      name: "Algorithms & Data Structures",
      instructor: "Prof. Michael Brown",
      room: "CS-101",
      credits: 3,
      color: "purple",
      schedule: [
        { day: "Monday", time: "1:00 PM", duration: 90 },
        { day: "Wednesday", time: "1:00 PM", duration: 90 }
      ]
    },
    {
      id: 4,
      code: "CS304",
      name: "Operating Systems",
      instructor: "Prof. Emily Davis",
      room: "CS-203",
      credits: 3,
      color: "orange",
      schedule: [
        { day: "Tuesday", time: "10:00 AM", duration: 90 },
        { day: "Thursday", time: "10:00 AM", duration: 90 }
      ]
    },
    {
      id: 5,
      code: "CS305",
      name: "Computer Networks",
      instructor: "Prof. David Wilson",
      room: "CS-102",
      credits: 3,
      color: "red",
      schedule: [
        { day: "Wednesday", time: "3:00 PM", duration: 90 },
        { day: "Friday", time: "3:00 PM", duration: 90 }
      ]
    },
    {
      id: 6,
      code: "CS306",
      name: "Software Engineering",
      instructor: "Prof. Lisa Anderson",
      room: "CS-301",
      credits: 3,
      color: "indigo",
      schedule: [
        { day: "Monday", time: "11:00 AM", duration: 60 },
        { day: "Wednesday", time: "11:00 AM", duration: 60 },
        { day: "Friday", time: "11:00 AM", duration: 60 }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      red: "bg-red-100 text-red-800 border-red-200",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    return colorMap[color] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getScheduleForDayAndTime = (day, time) => {
    return courses.find(course => 
      course.schedule.some(slot => 
        slot.day === day && slot.time === time
      )
    );
  };

  const getScheduleInfo = (day, time) => {
    const course = courses.find(course => 
      course.schedule.some(slot => 
        slot.day === day && slot.time === time
      )
    );
    
    if (course) {
      const slot = course.schedule.find(s => s.day === day && s.time === time);
      return { course, slot };
    }
    return null;
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderWeekView = () => {
    return (
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-8 bg-gray-50 border-b">
              <div className="p-3 text-sm font-medium text-gray-500">Time</div>
              {weekDays.map(day => (
                <div key={day} className="p-3 text-sm font-medium text-gray-900 text-center">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>
            
            {/* Schedule Grid */}
            {timeSlots.map(time => (
              <div key={time} className="grid grid-cols-8 border-b">
                <div className="p-3 text-sm text-gray-600 border-r">{time}</div>
                {weekDays.map(day => {
                  const scheduleInfo = getScheduleInfo(day, time);
                  if (scheduleInfo) {
                    const { course, slot } = scheduleInfo;
                    return (
                      <div key={`${day}-${time}`} className="p-2 border-r">
                        <div className={`p-2 rounded-lg border text-xs ${getColorClasses(course.color)} h-full`}>
                          <div className="font-semibold">{course.code}</div>
                          <div className="text-xs opacity-75 truncate">{course.name}</div>
                          <div className="text-xs opacity-75 mt-1">{course.room}</div>
                        </div>
                      </div>
                    );
                  }
                  return <div key={`${day}-${time}`} className="p-2 border-r"></div>;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const scheduleList = [];
    
    courses.forEach(course => {
      course.schedule.forEach(slot => {
        scheduleList.push({
          ...course,
          ...slot
        });
      });
    });

    const sortedSchedule = scheduleList.sort((a, b) => {
      const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.time.localeCompare(b.time);
    });

    return (
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedSchedule.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.day}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getColorClasses(item.color)}`}>
                        {item.code}
                      </span>
                      <div className="text-sm text-gray-900">{item.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.instructor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.room}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.duration} min</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Schedule</h1>
            <p className="text-gray-600 mt-1">View your weekly class schedule</p>
          </div>
          <button
            onClick={() => navigate('/academic-ticket/studentdashboard')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedView("week")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedView === "week"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Week View
                </button>
                <button
                  onClick={() => setSelectedView("list")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedView === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  List View
                </button>
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
              Export Schedule
            </button>
          </div>
        </div>

        {/* Course Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getColorClasses(course.color)}`}>
                      {course.code}
                    </span>
                    <span className="text-sm text-gray-500">{course.credits} credits</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.instructor}</p>
                </div>
                <BookOpen className="text-gray-400" size={20} />
              </div>
              
              <div className="space-y-2">
                {course.schedule.map((slot, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar size={14} />
                    <span>{slot.day}</span>
                    <Clock size={14} />
                    <span>{slot.time} ({slot.duration} min)</span>
                    <MapPin size={14} />
                    <span>{course.room}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Schedule View */}
        {selectedView === "week" ? renderWeekView() : renderListView()}
      </div>
    </div>
  );
};

export default CourseSchedule;
