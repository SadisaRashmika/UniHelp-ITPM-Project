import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, User } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const BookingModal = ({ timeslot, onClose, onSuccess }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    fetchBookedSeats();
  }, [timeslot]);

  const fetchBookedSeats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings/timeslot/${timeslot.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBookedSeats(data.bookings.map(b => b.seat_number));
      }
    } catch (error) {
      console.error('Failed to fetch booked seats:', error);
    }
  };

  if (!timeslot) return null;

  const totalSeats = timeslot.seat_count || 40;
  const seatsPerRow = 10;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  const handleBook = async () => {
    if (!selectedSeat) {
      setError('Please select a seat');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          timeslot_id: timeslot.id,
          seat_number: selectedSeat
        })
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.booking);
      } else {
        setError(data.message || 'Failed to book seat');
      }
    } catch (err) {
      setError(err.message || 'Failed to book seat');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedSeat(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Book Your Seat</h2>
            <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="mt-2 text-sm text-blue-100">
            <p className="font-medium">{timeslot.subject_name} ({timeslot.subject_code})</p>
            <p>{timeslot.room_name} • {timeslot.start_time?.substring(0, 5)} - {timeslot.end_time?.substring(0, 5)}</p>
            <p className="mt-1">{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][timeslot.day_of_week - 1]}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4 text-center">
            Select a seat for this lecture ({bookedSeats.length} of {totalSeats} booked)
          </p>

          {/* Seat Grid */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-center text-xs text-gray-500 mb-3">FRONT</div>
            <div className="space-y-2">
              {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2">
                  {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                    const seatNum = rowIndex * seatsPerRow + seatIndex + 1;
                    if (seatNum > totalSeats) return null;
                    
                    const isBooked = bookedSeats.includes(seatNum);
                    
                    return (
                      <button
                        key={seatNum}
                        onClick={() => !isBooked && setSelectedSeat(seatNum)}
                        disabled={isBooked}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          isBooked
                            ? 'bg-red-100 text-red-400 cursor-not-allowed border-2 border-red-200'
                            : selectedSeat === seatNum
                              ? 'bg-blue-600 text-white shadow-lg scale-110'
                              : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-400'
                        }`}
                        title={isBooked ? 'Already booked' : `Seat ${seatNum}`}
                      >
                        {seatNum}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-200 rounded"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBook}
              disabled={!selectedSeat || loading}
              className={`flex-1 py-2 px-4 rounded-lg text-white font-medium transition-all ${
                selectedSeat && !loading
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {loading ? 'Booking...' : `Book Seat #${selectedSeat || '?'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
