import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, MapPin, BookOpen, Users, Clock, Save, X } from 'lucide-react';
import TimetableGrid from './TimetableGrid';

const API_URL = 'http://localhost:5000/api';

const AdminTimetableContent = () => {
  const [timeslots, setTimeslots] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    subject_id: '',
    lecturer_id: '',
    location_id: '',
    day_of_week: 1,
    start_time: '08:00',
    end_time: '10:00'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('unihelp_token');
      
      const [timeslotsRes, subjectsRes, locationsRes, lecturersRes] = await Promise.all([
        fetch(`${API_URL}/timetable/timeslots`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/timetable/subjects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/timetable/locations`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/timetable/admin/lecturers`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const timeslotsData = await timeslotsRes.json();
      const subjectsData = await subjectsRes.json();
      const locationsData = await locationsRes.json();
      const lecturersData = await lecturersRes.json();

      if (timeslotsData.success) setTimeslots(timeslotsData.timeslots);
      if (subjectsData.success) setSubjects(subjectsData.subjects);
      if (locationsData.success) setLocations(locationsData.locations);
      if (lecturersData.success) {
        setLecturers(lecturersData.lecturers.map(l => ({ id: l.id, name: l.full_name })));
      }

    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeslot = async () => {
    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/admin/timeslots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setTimeslots([...timeslots, data.timeslot]);
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to add timeslot:', error);
    }
  };

  const handleUpdateTimeslot = async () => {
    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/admin/timeslots/${editingSlot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setTimeslots(timeslots.map(t => t.id === editingSlot.id ? data.timeslot : t));
        setEditingSlot(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to update timeslot:', error);
    }
  };

  const handleDeleteTimeslot = async (id) => {
    if (!confirm('Are you sure you want to delete this timeslot?')) return;

    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/admin/timeslots/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setTimeslots(timeslots.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete timeslot:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      subject_id: '',
      lecturer_id: '',
      location_id: '',
      day_of_week: 1,
      start_time: '08:00',
      end_time: '10:00'
    });
  };

  const openEditModal = (slot) => {
    setEditingSlot(slot);
    setFormData({
      subject_id: slot.subject_id,
      lecturer_id: slot.lecturer_id,
      location_id: slot.location_id,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time?.substring(0, 5) || '08:00',
      end_time: slot.end_time?.substring(0, 5) || '10:00'
    });
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading timetable data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Timetable Management</h2>
          <p className="text-gray-600 text-sm">Create, edit, and manage lecture timeslots</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Timeslot
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{timeslots.length}</p>
              <p className="text-sm text-gray-500">Timeslots</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{subjects.length}</p>
              <p className="text-sm text-gray-500">Subjects</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{locations.length}</p>
              <p className="text-sm text-gray-500">Locations</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Users size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{lecturers.length}</p>
              <p className="text-sm text-gray-500">Lecturers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-lg font-semibold mb-4">Weekly Schedule</h3>
        <TimetableGrid
          timeslots={timeslots}
          userRole="admin"
          onSlotClick={openEditModal}
        />
      </div>

      {/* Timeslot List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">All Timeslots</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Subject</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Lecturer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Day</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Room</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeslots.map(slot => (
                <tr key={slot.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{slot.subject_name}</div>
                    <div className="text-xs text-gray-500">{slot.subject_code}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{slot.lecturer_name}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][slot.day_of_week - 1]}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {slot.start_time?.substring(0, 5)} - {slot.end_time?.substring(0, 5)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{slot.room_name}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openEditModal(slot)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTimeslot(slot.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingSlot) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingSlot ? 'Edit Timeslot' : 'Add New Timeslot'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSlot(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.subject_name} ({s.subject_code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lecturer</label>
                <select
                  value={formData.lecturer_id}
                  onChange={(e) => setFormData({ ...formData, lecturer_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Lecturer</option>
                  {lecturers.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={formData.location_id}
                  onChange={(e) => setFormData({ ...formData, location_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.room_name} ({l.seat_count} seats)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  value={formData.day_of_week}
                  onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSlot(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingSlot ? handleUpdateTimeslot : handleAddTimeslot}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {editingSlot ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTimetableContent;
