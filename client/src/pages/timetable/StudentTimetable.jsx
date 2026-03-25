import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import TimetableGrid from '../../components/timetable/TimetableGrid';
import BookingModal from '../../components/timetable/BookingModal';
const API_URL = 'http://localhost:5000/api';

const StudentTimetable = () => {
  const [timeslots, setTimeslots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [timeslotsRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/timetable/timeslots`, { headers }),
        fetch(`${API_URL}/bookings/my`, { headers })
      ]);

      const timeslotsData = await timeslotsRes.json();
      const bookingsData = await bookingsRes.json();

      if (timeslotsData.success) {
        setTimeslots(timeslotsData.timeslots);
      }
      if (bookingsData.success) {
        setBookings(bookingsData.bookings);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBook = async (slotId, seatNumber) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ timeslot_id: slotId, seat_number: seatNumber })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Booking failed');
    }

    // Refresh bookings
    fetchData();
  };

  const getBookingForSlot = (slotId) => {
    return bookings.find(b => b.timeslot_id === slotId);
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
            <h1 className="text-2xl font-bold text-gray-800">My Timetable</h1>
            <p className="text-gray-600 mt-1">View your weekly schedule and book seats</p>
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
              <Calendar size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
              <p className="text-sm text-gray-500">Booked</p>
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
          bookings={bookings}
          onSlotClick={handleSlotClick}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border-2 border-green-300 rounded" />
          <span>Your Booking</span>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        slot={selectedSlot}
        isOpen={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onBook={handleBook}
        existingBooking={selectedSlot ? getBookingForSlot(selectedSlot.id) : null}
      />
    </div>
  );
};

export default StudentTimetable;
