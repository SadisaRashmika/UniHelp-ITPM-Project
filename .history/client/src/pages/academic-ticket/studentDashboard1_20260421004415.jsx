import React, { useState, useEffect } from "react";
import { 
  Trophy, GraduationCap, Calendar, TrendingUp, FileText, Brain, Activity,
  Clock, MapPin, AlertTriangle, Info, Plus, Upload, Mail
} from "lucide-react";

const StudentDashboardContent = () => {
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockDeadlines = [
      {
        id: 1,
        title: "Data Structures Assignment",
        course: "CS201",
        type: "assignment",
        dueDate: "2024-04-10",
        dueTime: "11:59 PM",
        priority: "high"
      }
    ];

    const mockSchedule = [
      {
        id: 1,
        course: "CS201",
        title: "Data Structures",
        time: "8:00 AM",
        room: "Room 301",
        type: "lecture"
      }
    ];

    setUpcomingDeadlines(mockDeadlines);
    setTodaySchedule(mockSchedule);
    setLoading(false);
  }, []);

  const getPriorityColor = (priority) => {
    if (priority === "high") return "text-red-600 bg-red-100";
    if (priority === "medium") return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="p-6">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-6">

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>

            {upcomingDeadlines.map((deadline) => (
              <div 
                key={deadline.id} 
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-3"
              >
                {/* LEFT */}
                <div>
                  <h4 className="font-medium">{deadline.title}</h4>
                  <p className="text-sm text-gray-600">{deadline.course}</p>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="text-sm font-medium">{deadline.dueDate}</p>
                  <p className="text-xs text-gray-500">{deadline.dueTime}</p>
                  <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(deadline.priority)}`}>
                    {deadline.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>

            {todaySchedule.map((schedule) => (
              <div key={schedule.id} className="flex gap-3 mb-3">
                <FileText />
                <div>
                  <h4>{schedule.title}</h4>
                  <p className="text-sm">{schedule.course}</p>
                  <p className="text-xs text-gray-500">
                    {schedule.time} | {schedule.room}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-100 rounded">Register</button>
              <button className="p-4 bg-green-100 rounded">Submit</button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default studentDashboard1;