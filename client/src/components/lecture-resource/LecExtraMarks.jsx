import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Copy, Check, Download } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_BASE = 'http://localhost:5000';
const formatDate = (iso) => (iso ? new Date(iso).toISOString().split('T')[0] : '');
const normalizeProfileUrl = (value) => {
  if (!value) return '';
  return String(value).startsWith('http') ? value : `${API_BASE}${value}`;
};

const mapReq = (r) => ({
  id: r.id,
  studentName: r.student_name,
  studentInitials: r.student_initials,
  studentId: r.student_id,
  studentPhoto: normalizeProfileUrl(r.student_profile_image_url),
  totalLikes: r.total_likes,
  subject: r.subject,
  status: r.status,
  uniqueCode: r.unique_code,
  marksAdded: r.marks_added,
  requestedAt: r.requested_at,
  approvedAt: r.approved_at,
});

const LecExtraMarks = ({ lecturerId = 'LEC001', onPendingChange = () => {} }) => {
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(null);
  const [filterTab, setFilterTab] = useState('all'); // all, pending, approved, rejected
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const loadRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/lecturer/bonus-requests?lecturerId=${lecturerId}`);
      setRequests((res.data || []).map(mapReq));
    } catch (error) {
      console.error('Error loading bonus requests:', error);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [lecturerId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReview = async (id, action) => {
    try {
      const res = await axios.patch(`${API_BASE}/api/lecturer/bonus-requests/${id}/review`, {
        lecturerId,
        action,
      });
      await loadRequests();
      if (action === 'approved') {
        onPendingChange(-1);
        showToast('Approved. Student likes deducted by 100.');
      } else {
        onPendingChange(-1);
        showToast('Request rejected. Student likes unchanged.');
      }
    } catch (error) {
      console.error('Error reviewing bonus request:', error);
      showToast(error?.response?.data?.message || 'Failed to review request');
    }
  };

  const handleMarkAdded = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/lecturer/bonus-requests/${id}/mark-added`, { lecturerId });
      await loadRequests();
      showToast('Marked as added.');
    } catch (error) {
      console.error('Error marking added:', error);
      showToast('Failed to mark as added');
    }
  };

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code || '').catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      let dataToExport = requests;
      let title = 'All Bonus Mark Requests';

      if (filterTab === 'pending') {
        dataToExport = requests.filter((r) => r.status === 'pending');
        title = 'Pending Bonus Mark Requests';
      } else if (filterTab === 'approved') {
        dataToExport = requests.filter((r) => r.status === 'approved');
        title = 'Approved Bonus Marks';
      } else if (filterTab === 'rejected') {
        dataToExport = requests.filter((r) => r.status === 'rejected');
        title = 'Rejected Bonus Requests';
      }

      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginLeft = 12;
      const marginRight = 12;
      const contentWidth = pageWidth - marginLeft - marginRight;
      const rowHeight = 7;
      let yPosition = 15;

      const headers = ['Student ID', 'Subject', 'Status', 'Date'];
      // Tight gap: Student ID -> Subject
      // Wide gap: Subject -> Status
      // Tight gap: Status -> Date
      const colX = [14, 42, 108, 142];

      const drawHeader = (y) => {
        pdf.setFillColor(25, 118, 210);
        pdf.rect(marginLeft, y - 5, contentWidth, 7, 'F');
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(255, 255, 255);

        headers.forEach((header, i) => {
          pdf.text(header, colX[i], y);
        });
      };

      const normalizeCell = (value, maxLen) => {
        const txt = String(value || '');
        return txt.length > maxLen ? `${txt.slice(0, maxLen - 1)}...` : txt;
      };

      // Add title
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(25, 118, 210);
      pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 12;

      // Add generation date
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      drawHeader(yPosition);

      yPosition += 10;

      // Add data rows
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);

      dataToExport.forEach((row, index) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = 15;
          drawHeader(yPosition);
          yPosition += 10;
          pdf.setFontSize(9);
          pdf.setFont(undefined, 'normal');
          pdf.setTextColor(0, 0, 0);
        }

        // Alternate row background color before placing row text
        if (index % 2 === 0) {
          pdf.setFillColor(245, 248, 255);
          pdf.rect(marginLeft, yPosition - 5.5, contentWidth, rowHeight, 'F');
        }

        const rowData = [
          normalizeCell(row.studentId, 14),
          normalizeCell(row.subject, 30),
          normalizeCell(row.status?.charAt(0).toUpperCase() + row.status?.slice(1), 12),
          normalizeCell(formatDate(row[row.status === 'approved' ? 'approvedAt' : 'requestedAt']), 12),
        ];

        rowData.forEach((data, i) => {
          pdf.text(String(data), colX[i], yPosition);
        });

        // Draw bottom border for row
        pdf.setDrawColor(220, 220, 220);
        pdf.line(marginLeft, yPosition + 1, pageWidth - marginRight, yPosition + 1);

        yPosition += rowHeight;
      });

      // Save PDF
      const filename = `bonus-marks-${filterTab}-${new Date().getTime()}.pdf`;
      pdf.save(filename);
      showToast(`PDF exported: ${filename}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Failed to generate PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const pending = requests.filter((r) => r.status === 'pending');
  const approved = requests.filter((r) => r.status === 'approved');
  const rejected = requests.filter((r) => r.status === 'rejected');

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Extra Marks Approval</h1>
          <p className="text-gray-400 text-sm mt-1">Approve or reject student requests (100 points = +3 marks)</p>
        </div>
        <button
          onClick={generatePDF}
          disabled={generatingPDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Download size={16} /> {generatingPDF ? 'Generating...' : 'Export PDF'}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: 'all', label: 'All Requests', count: requests.length },
          { key: 'pending', label: 'Pending', count: requests.filter((r) => r.status === 'pending').length },
          { key: 'approved', label: 'Approved', count: requests.filter((r) => r.status === 'approved').length },
          { key: 'rejected', label: 'Rejected', count: requests.filter((r) => r.status === 'rejected').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              filterTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {pending.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
            <div className="bg-gray-100 rounded-xl px-4 py-2 text-sm font-semibold text-gray-600">{pending.length} Pending</div>
          </div>

          {pending.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {r.studentPhoto ? (
                    <img
                      src={r.studentPhoto}
                      alt={r.studentName || 'Student'}
                      className="w-11 h-11 rounded-full border border-indigo-200 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {r.studentInitials}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{r.studentName}</p>
                    <p className="text-sm text-gray-400">ID: {r.studentId}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">{r.subject}</span>
                      <span className="text-sm text-gray-500">Current Points: <span className="font-medium text-gray-700">{r.totalLikes}</span></span>
                      <span className="text-sm">Requested Marks: <span className="font-semibold text-green-600">+3</span></span>
                      <span className="text-sm text-gray-400">{formatDate(r.requestedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleReview(r.id, 'approved')}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600">
                    <CheckCircle size={15} /> Approve
                  </button>
                  <button onClick={() => handleReview(r.id, 'rejected')}
                    className="flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50">
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {approved.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Approved Extra Marks</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-5 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>Student Name</span>
              <span>Student ID</span>
              <span>Subject</span>
              <span>Extra Marks</span>
              <span>Approved Date</span>
            </div>
            {approved.map((r) => (
              <div key={r.id} className="grid grid-cols-5 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {r.studentPhoto ? (
                    <img
                      src={r.studentPhoto}
                      alt={r.studentName || 'Student'}
                      className="w-8 h-8 rounded-full border border-indigo-200 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {r.studentInitials}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-800">{r.studentName}</span>
                </div>
                <span className="text-sm text-gray-500">{r.studentId}</span>
                <div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{r.subject}</span>
                </div>
                <div>
                  {r.marksAdded ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold bg-green-500 text-white px-2.5 py-1.5 rounded-full w-fit">
                      <CheckCircle size={11} /> +3 marks
                    </span>
                  ) : (
                    <button onClick={() => handleMarkAdded(r.id)}
                      className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200">
                      +3 marks
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{formatDate(r.approvedAt || r.requestedAt)}</span>
                  {r.uniqueCode && (
                    <button onClick={() => handleCopy(r.id, r.uniqueCode)} className="text-gray-300 hover:text-gray-600" title="Copy code">
                      {copied === r.id ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rejected.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Rejected Requests</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {rejected.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  {r.studentPhoto ? (
                    <img
                      src={r.studentPhoto}
                      alt={r.studentName || 'Student'}
                      className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                      {r.studentInitials}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">{r.studentName}</p>
                    <p className="text-xs text-gray-400">{r.subject} \u00b7 {formatDate(r.requestedAt)}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-red-100 text-red-600 px-3 py-1.5 rounded-full">Rejected</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && approved.length === 0 && rejected.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 text-sm font-medium">No extra marks requests yet.</p>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default LecExtraMarks;
