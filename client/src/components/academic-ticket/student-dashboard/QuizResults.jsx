import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock, Award, ChevronRight, ArrowLeft, Download, Share2 } from "lucide-react";

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state) {
      const { quizData, submissionResult } = location.state;
      setQuizData(quizData);
      setSubmissionResult(submissionResult);
      setLoading(false);
    } else {
      // If no state, fetch from API using submission ID
      const submissionId = window.location.pathname.split('/').pop();
      fetchQuizResults(submissionId);
    }
  }, [location.state]);

  const fetchQuizResults = async (submissionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz-submissions/${submissionId}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissionResult(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 85) return "A";
    if (percentage >= 80) return "A-";
    if (percentage >= 75) return "B+";
    if (percentage >= 70) return "B";
    if (percentage >= 65) return "B-";
    if (percentage >= 60) return "C+";
    if (percentage >= 55) return "C";
    if (percentage >= 50) return "C-";
    return "F";
  };

  const handleDownloadResults = () => {
    // Create a printable version of results
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Quiz Results - ${quizData?.title || 'Quiz'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .score { font-size: 48px; font-weight: bold; color: #2563eb; }
            .question { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .correct { background-color: #f0fdf4; }
            .incorrect { background-color: #fef2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${quizData?.title || 'Quiz'} Results</h1>
            <div class="score">${submissionResult?.score || 0}/${submissionResult?.max_score || 0}</div>
            <p>Percentage: ${submissionResult?.percentage || 0}%</p>
            <p>Grade: ${getGrade(submissionResult?.percentage || 0)}</p>
          </div>
          ${submissionResult?.detailedAnswers?.map((answer, index) => `
            <div class="question ${answer.isCorrect ? 'correct' : 'incorrect'}">
              <h3>Question ${index + 1}</h3>
              <p><strong>${answer.questionText}</strong></p>
              <p>Your Answer: ${answer.studentAnswer || 'Not answered'}</p>
              <p>Correct Answer: ${answer.correctAnswer}</p>
              <p>Points: ${answer.earnedMarks}/${answer.marks}</p>
            </div>
          `).join('') || ''}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShareResults = () => {
    const shareText = `I scored ${submissionResult?.percentage || 0}% on the "${quizData?.title || 'Quiz'}"!`;
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Results',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz results...</p>
        </div>
      </div>
    );
  }

  if (!submissionResult) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h2>
          <button
            onClick={() => navigate('/academic-ticket/studentdashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/academic-ticket/studentdashboard')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
              <p className="text-gray-600">{quizData?.title || 'Quiz'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadResults}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={handleShareResults}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        {/* Score Overview */}
        <div className="bg-white rounded-xl shadow p-8 mb-6">
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(submissionResult.percentage)}`}>
              {submissionResult.score}/{submissionResult.maxScore}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {submissionResult.percentage}%
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="text-yellow-500" size={24} />
              <span className="text-2xl font-semibold text-gray-900">
                Grade: {getGrade(submissionResult.percentage)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Time: {Math.floor(submissionResult.timeSpent / 60)}m {submissionResult.timeSpent % 60}s</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>
                  {submissionResult.detailedAnswers?.filter(a => a.isCorrect).length || 0} correct out of {submissionResult.detailedAnswers?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {submissionResult.detailedAnswers?.filter(a => a.isCorrect).length || 0}
            </div>
            <p className="text-gray-600">Correct Answers</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {submissionResult.detailedAnswers?.filter(a => !a.isCorrect).length || 0}
            </div>
            <p className="text-gray-600">Incorrect Answers</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {Math.round(submissionResult.percentage)}%
            </div>
            <p className="text-gray-600">Accuracy Rate</p>
          </div>
        </div>

        {/* Detailed Answers */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Answers</h2>
          <div className="space-y-4">
            {submissionResult.detailedAnswers?.map((answer, index) => (
              <div
                key={answer.questionNumber}
                className={`border rounded-lg p-4 ${
                  answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {answer.isCorrect ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <XCircle className="text-red-600" size={20} />
                    )}
                    <h3 className="font-semibold text-gray-900">
                      Question {answer.questionNumber}
                    </h3>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {answer.earnedMarks}/{answer.marks} points
                  </div>
                </div>
                
                <p className="text-gray-800 mb-3">{answer.questionText}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Your Answer:</span>
                    <p className={`mt-1 p-2 rounded ${
                      answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {answer.studentAnswer || 'Not answered'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Correct Answer:</span>
                    <p className="mt-1 p-2 bg-gray-100 text-gray-800 rounded">
                      {answer.correctAnswer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        {submissionResult.feedback && (
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-800">{submissionResult.feedback}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/academic-ticket/studentdashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/academic-ticket/student-dashboard/tasks')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
