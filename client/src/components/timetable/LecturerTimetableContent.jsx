import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, Users, Edit2, CheckSquare, X, Save, Download, BarChart3, User } from 'lucide-react';
import TimetableGrid from './TimetableGrid';

const API_URL = 'http://localhost:5000/api';

const LecturerTimetableContent = ({ lecturerId, user }) => {
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editTopic, setEditTopic] = useState('');
  const [editNotice, setEditNotice] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [stats, setStats] = useState({ totalLectures: 0, totalBookings: 0, hoursPerWeek: 0 });

  useEffect(() => {
    fetchMyTimetable();
    fetchStats();
  }, [lecturerId]);

  const fetchMyTimetable = async () => {
    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/timeslots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        // Filter to only show this lecturer's timeslots
        // lecturer_id_number is the user's id_number (e.g., "LEC001"), matching lecturerId from auth
        const mySlots = data.timeslots.filter(slot => slot.lecturer_id_number === lecturerId);
        setTimeslots(mySlots);
      }
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/lecturer/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchBookings = async (timeslotId) => {
    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/bookings/timeslot/${timeslotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setEditTopic(slot.lecture_topic || '');
    setEditNotice(slot.notice || '');
    fetchBookings(slot.id);
  };

  const handleSaveDetails = async () => {
    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/timeslots/${selectedSlot.id}/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ lecture_topic: editTopic, notice: editNotice })
      });
      const data = await response.json();
      if (data.success) {
        // Update local state
        setTimeslots(slots => slots.map(s => 
          s.id === selectedSlot.id 
            ? { ...s, lecture_topic: editTopic, notice: editNotice }
            : s
        ));
        setSelectedSlot({ ...selectedSlot, lecture_topic: editTopic, notice: editNotice });
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Failed to save details:', error);
    }
  };

  const handleMarkAttendance = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/bookings/${bookingId}/attendance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, attendance_status: status } : b
        ));
      }
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const handleDownloadCSV = async (timeslotId) => {
    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/lecturer/attendance-csv/${timeslotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${timeslotId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading your timetable...</div>;
  }

  return (
    <div className="space-y-6">
      {/* User Identity Card */}
      {user && (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user.fullName || user.full_name || 'Lecturer'}</h3>
                <div className="flex items-center gap-3 text-emerald-100 text-sm">
                  <span className="bg-white/20 px-2 py-0.5 rounded">{user.idNumber || lecturerId}</span>
                  <span>Lecturer</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <Calendar size={18} />
              <span className="text-sm font-medium">{stats.totalLectures} Sessions</span>
            </div>
          </div>
        </div>
      )}

      {/* Header (fallback when no user) */}
      {!user && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Teaching Schedule</h2>
            <p className="text-gray-600 text-sm">Click on a lecture to manage topics, notices, and attendance</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <Calendar size={18} className="text-blue-600" />
            <span className="text-sm font-medium">{stats.totalLectures} Sessions</span>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalLectures}</p>
              <p className="text-sm text-gray-500">Total Lectures</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
              <p className="text-sm text-gray-500">Total Bookings</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.hoursPerWeek}</p>
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
          onSlotClick={handleSlotClick}
        />
      </div>

      {/* Selected Slot Details */}
      {selectedSlot && !showEditModal && !showAttendance && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">{selectedSlot.subject_name}</h3>
            <button onClick={() => setSelectedSlot(null)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-sm">
              <span className="text-gray-500">Day:</span>
              <span className="ml-2 font-medium">{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][selectedSlot.day_of_week - 1]}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Time:</span>
              <span className="ml-2 font-medium">{selectedSlot.start_time?.substring(0, 5)} - {selectedSlot.end_time?.substring(0, 5)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Room:</span>
              <span className="ml-2 font-medium">{selectedSlot.room_name}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Bookings:</span>
              <span className="ml-2 font-medium">{bookings.length} / {selectedSlot.seat_count}</span>
            </div>
          </div>

          {selectedSlot.lecture_topic && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-xs text-blue-600 font-medium">TOPIC</span>
              <p className="text-sm text-gray-700">{selectedSlot.lecture_topic}</p>
            </div>
          )}

          {selectedSlot.notice && (
            <div className="mb-3 p-3 bg-amber-50 rounded-lg">
              <span className="text-xs text-amber-600 font-medium">NOTICE</span>
              <p className="text-sm text-gray-700">{selectedSlot.notice}</p>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={16} />
              Edit Topic/Notice
            </button>
            <button
              onClick={() => setShowAttendance(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckSquare size={16} />
              Mark Attendance ({bookings.length})
            </button>
            {bookings.length > 0 && (
              <button
                onClick={() => handleDownloadCSV(selectedSlot.id)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download size={16} />
                Download CSV
              </button>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Lecture Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lecture Topic</label>
                <textarea
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter lecture topic..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notice (Students will be notified in real-time)</label>
                <textarea
                  value={editNotice}
                  onChange={(e) => setEditNotice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter notice..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDetails}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Mark Attendance - {selectedSlot.subject_name}</h3>
              <div className="flex items-center gap-3">
                {bookings.length > 0 && (
                  <button
                    onClick={() => handleDownloadCSV(selectedSlot.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm"
                  >
                    <Download size={14} />
                    CSV
                  </button>
                )}
                <button onClick={() => setShowAttendance(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No bookings yet</p>
            ) : (
              <div className="space-y-2">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{booking.student_name || `Student ${booking.student_id}`}</p>
                      <p className="text-sm text-gray-500">Seat #{booking.seat_number}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkAttendance(booking.id, 'attended')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          booking.attendance_status === 'attended'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        ✅ Attended
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(booking.id, 'absent')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          booking.attendance_status === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        ❌ Absent
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(booking.id, 'pending')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          booking.attendance_status === 'pending' || booking.attendance_status === 'booked'
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        ⏳ Pending
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerTimetableContent;
