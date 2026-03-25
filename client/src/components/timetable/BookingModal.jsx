import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const BookingModal = ({ slot, isOpen, onClose, onBook, existingBooking }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !slot) return null;

  const totalSeats = slot.seat_count || 40;
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
      await onBook(slot.id, selectedSeat);
      setSelectedSeat(null);
      onClose();
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
            <h2 className="text-lg font-bold">Book Seat</h2>
            <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="mt-2 text-sm text-blue-100">
            <p className="font-medium">{slot.subject_name}</p>
            <p>{slot.room_name} • {slot.start_time?.substring(0, 5)} - {slot.end_time?.substring(0, 5)}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {existingBooking ? (
            <div className="text-center py-6">
              <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
              <h3 className="text-lg font-semibold text-gray-800">Already Booked</h3>
              <p className="text-gray-600 mt-1">Your seat: #{existingBooking.seat_number}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Select a seat for this lecture
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
                        
                        return (
                          <button
                            key={seatNum}
                            onClick={() => setSelectedSeat(seatNum)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                              selectedSeat === seatNum
                                ? 'bg-blue-600 text-white shadow-lg scale-110'
                                : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-400'
                            }`}
                          >
                            {seatNum}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
