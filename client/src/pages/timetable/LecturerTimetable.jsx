import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import TimetableGrid from '../../components/timetable/TimetableGrid';

const API_URL = 'http://localhost:5000/api';

const LecturerTimetable = () => {
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    fetchTimeslots();
  }, []);

  const fetchTimeslots = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/timetable/timeslots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setTimeslots(data.timeslots);
      }
    } catch (error) {
      console.error('Failed to fetch timeslots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading timetable...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Teaching Schedule</h1>
            <p className="text-gray-600 mt-1">View your weekly lecture schedule</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Calendar size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Week {currentWeek + 1}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{timeslots.length}</p>
              <p className="text-sm text-gray-500">Sessions</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{timeslots.reduce((acc, s) => acc + (s.seat_count || 40), 0)}</p>
              <p className="text-sm text-gray-500">Total Seats</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{timeslots.length * 2}</p>
              <p className="text-sm text-gray-500">Hours/Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <TimetableGrid
          timeslots={timeslots}
          userRole="lecturer"
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded" />
          <span>Lecture Session</span>
        </div>
      </div>
    </div>
  );
};

export default LecturerTimetable;
