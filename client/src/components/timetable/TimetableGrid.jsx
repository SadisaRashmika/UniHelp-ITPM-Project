import React from 'react';
import { Clock, MapPin, User, BookOpen } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
];

const TimetableGrid = ({ timeslots, onSlotClick, userRole, bookings = [] }) => {
  // Group timeslots by day and time
  const getSlotForDayTime = (day, timeStart) => {
    return timeslots.find(slot => {
      const slotDay = DAYS[slot.day_of_week - 1];
      const startTime = slot.start_time.substring(0, 5);
      return slotDay === day && startTime === timeStart.split(' - ')[0];
    });
  };

  // Check if user has booked this slot
  const isBooked = (slotId) => {
    return bookings.some(b => b.timeslot_id === slotId);
  };

  // Get booking info for a slot
  const getBookingInfo = (slotId) => {
    return bookings.find(b => b.timeslot_id === slotId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-600 min-w-[100px]">
              Time
            </th>
            {DAYS.map(day => (
              <th key={day} className="p-3 bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-600 min-w-[150px]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((time, timeIndex) => (
            <tr key={time}>
              <td className="p-2 bg-gray-50 border border-gray-200 text-xs font-medium text-gray-500 text-center">
                {time}
              </td>
              {DAYS.map(day => {
                const slot = getSlotForDayTime(day, time);
                const booked = slot ? isBooked(slot.id) : false;
                const bookingInfo = slot ? getBookingInfo(slot.id) : null;

                return (
                  <td key={`${day}-${time}`} className="p-1 border border-gray-200">
                    {slot ? (
                      <div
                        onClick={() => onSlotClick && onSlotClick(slot)}
                        className={`p-2 rounded-lg cursor-pointer transition-all h-full min-h-[80px] ${
                          booked
                            ? 'bg-green-50 border-2 border-green-300 hover:border-green-400'
                            : 'bg-blue-50 border-2 border-blue-200 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center gap-1 text-xs font-semibold text-blue-800 mb-1">
                          <BookOpen size={12} />
                          <span className="truncate">{slot.subject_name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <User size={10} />
                          <span className="truncate">{slot.lecturer_name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={10} />
                          <span className="truncate">{slot.room_name}</span>
                        </div>
                        {booked && (
                          <div className="mt-1 text-xs font-medium text-green-600">
                            Seat #{bookingInfo?.seat_number}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full min-h-[80px] bg-gray-50 rounded-lg" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableGrid;
