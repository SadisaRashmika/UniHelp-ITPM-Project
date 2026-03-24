import React, { useEffect, useState } from 'react';
import { X, FileText, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const statusBadge = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

const downloadFile = async (url, filename) => {
  if (!url) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || 'file.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

const StuMyUploadsModal = ({ isOpen, onClose, studentId = 'STU001', onChanged }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/student/notes/my-uploads?studentId=${studentId}`);
      setItems(res.data || []);
    } catch (error) {
      console.error('Error loading my uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    load();
  }, [isOpen, studentId]);

  const handleDeleteAccepted = async (noteId) => {
    const confirmed = window.confirm('Delete this accepted upload?');
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/api/student/notes/my-uploads/${noteId}`, {
        data: { studentId },
      });
      await load();
      onChanged?.();
    } catch (error) {
      console.error('Error deleting accepted upload:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-gray-900">My Uploads</h3>
              <p className="text-sm text-gray-400 mt-0.5">Track pending, accepted, and rejected notes</p>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors mt-0.5">
              <X size={20} />
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Loading uploads...</div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">No uploads yet.</div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.lecture_title} · {item.subject} · {item.year} · {item.semester}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Lecturer: {item.lecturer_name || '-'}</p>

                      <button
                        onClick={() => downloadFile(`${API_BASE}${item.file_url}`, item.filename)}
                        className="mt-2 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                      >
                        <FileText size={13} /> {item.filename}
                      </button>

                      {item.status === 'rejected' && item.rejection_note && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-2">
                          Rejection reason: {item.rejection_note}
                        </div>
                      )}
                    </div>

                    <span className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${statusBadge[item.status] || 'bg-gray-100 text-gray-600'}`}>
                      {item.status}
                    </span>
                  </div>

                  {item.status === 'accepted' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleDeleteAccepted(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                      >
                        <Trash2 size={12} /> Delete Accepted Upload
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StuMyUploadsModal;
