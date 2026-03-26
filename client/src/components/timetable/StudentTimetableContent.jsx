import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import TimetableGrid from './TimetableGrid';
import BookingModal from './BookingModal';

const API_URL = 'http://localhost:5000/api';

const StudentTimetableContent = ({ studentId }) => {
  const [timeslots, setTimeslots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchTimetable();
    fetchMyBookings();
  }, [studentId]);

  const fetchTimetable = async () => {
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
      console.error('Failed to fetch timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMyBookings(data.bookings);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handleSlotClick = (slot) => {
    // Check if already booked
    const existingBooking = myBookings.find(b => b.timeslot_id === slot.id);
    if (existingBooking) {
      // Show booking details
      setSelectedSlot({ ...slot, myBooking: existingBooking });
    } else {
      // Open booking modal
      setSelectedSlot(slot);
      setShowBookingModal(true);
    }
  };

  const handleBookingSuccess = (booking) => {
    setMyBookings([...myBookings, booking]);
    setShowBookingModal(false);
    setSelectedSlot(null);
    fetchMyBookings(); // Refresh bookings
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMyBookings(myBookings.filter(b => b.id !== bookingId));
        setSelectedSlot(null);
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  // Get attendance icon
  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'attended':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'absent':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-amber-500" />;
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading timetable...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Weekly Timetable</h2>
          <p className="text-gray-600 text-sm">Click on a lecture to book your seat</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <Calendar size={18} className="text-blue-600" />
            <span className="text-sm font-medium">{myBookings.length} Bookings</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{timeslots.length}</p>
              <p className="text-sm text-gray-500">Lectures</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {myBookings.filter(b => b.attendance_status === 'attended').length}
              </p>
              <p className="text-sm text-gray-500">Attended</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {myBookings.filter(b => b.attendance_status === 'booked').length}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{myBookings.length * 2}</p>
              <p className="text-sm text-gray-500">Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <TimetableGrid
          timeslots={timeslots}
          userRole="student"
          myBookings={myBookings}
          onSlotClick={handleSlotClick}
        />
      </div>

      {/* My Bookings List */}
      {myBookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">My Bookings</h3>
          <div className="space-y-3">
            {myBookings.map((booking) => {
              const slot = timeslots.find(t => t.id === booking.timeslot_id);
              const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
              
              return (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getAttendanceIcon(booking.attendance_status)}
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {booking.attendance_status}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{booking.subject_name || slot?.subject_name}</p>
                      <p className="text-sm text-gray-500">
                        {days[booking.day_of_week - 1]} • {booking.start_time?.substring(0, 5)} - {booking.end_time?.substring(0, 5)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">Seat #{booking.seat_number}</p>
                      <p className="text-sm text-gray-500">{booking.room_name}</p>
                    </div>
                    {booking.attendance_status === 'booked' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedSlot && (
        <BookingModal
          timeslot={selectedSlot}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedSlot(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Booking Details Modal */}
      {selectedSlot && !showBookingModal && selectedSlot.myBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Booking Details</h3>
              <button onClick={() => setSelectedSlot(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">{selectedSlot.subject_name}</p>
                <p className="text-sm text-gray-500">{selectedSlot.subject_code}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Day</p>
                  <p className="font-medium">{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][selectedSlot.day_of_week - 1]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{selectedSlot.start_time?.substring(0, 5)} - {selectedSlot.end_time?.substring(0, 5)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Room</p>
                  <p className="font-medium">{selectedSlot.room_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Seat</p>
                  <p className="font-medium">#{selectedSlot.myBooking.seat_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                {getAttendanceIcon(selectedSlot.myBooking.attendance_status)}
                <span className="text-sm font-medium text-gray-700 capitalize">
                  Attendance: {selectedSlot.myBooking.attendance_status}
                </span>
              </div>

              {selectedSlot.lecture_topic && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">TOPIC</p>
                  <p className="text-sm text-gray-700">{selectedSlot.lecture_topic}</p>
                </div>
              )}

              {selectedSlot.notice && (
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-xs text-amber-600 font-medium">NOTICE</p>
                  <p className="text-sm text-gray-700">{selectedSlot.notice}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              {selectedSlot.myBooking.attendance_status === 'booked' && (
                <button
                  onClick={() => handleCancelBooking(selectedSlot.myBooking.id)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTimetableContent;
