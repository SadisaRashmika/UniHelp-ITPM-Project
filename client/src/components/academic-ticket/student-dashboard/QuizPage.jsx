import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Play, RotateCcw, Book, Users, Calendar, Award, BarChart3 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const QuizPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [lightMode, setLightMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock quiz data
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load quiz data
    const mockQuiz = {
      id: quizId,
      title: "",
      course: "",
      description: "",
      duration: 0,
      questions: [],
      totalPoints: 0,
      passingScore: 0
    };

    // Simulate API call
    setTimeout(() => {
      setQuizData(mockQuiz);
      setLoading(false);
    }, 1000);
  }, [quizId]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(quizData.duration * 60);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += question.points;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    const percentage = (score / quizData.totalPoints) * 100;
    setShowResults(true);
    setQuizSubmitted(true);
    setQuizStarted(false);
    
    // Submit to API (mock)
    console.log('Quiz submitted:', { quizId, score, percentage });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quizData.questions.length) * 100;
  };

  if (loading) {
    return (
      <div className={`flex h-screen ${lightMode ? "bg-white text-black" : "bg-gray-100 text-gray-900"}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quizData.totalPoints) * 100;
    const passed = percentage >= (quizData.passingScore / quizData.totalPoints) * 100;

    return (
      <div className={`flex h-screen ${lightMode ? "bg-white text-black" : "bg-gray-100 text-gray-900"}`}>
        <div className="flex-1 flex flex-col p-6 overflow-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
            <div className={`text-2xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {passed ? 'PASSED!' : 'FAILED'}
            </div>
          </header>

          <main className="max-w-2xl mx-auto">
            <div className={`${lightMode ? "bg-white" : "bg-gray-800"} p-8 rounded-xl shadow`}>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">{score}</div>
                <div className="text-gray-600 mb-4">out of {quizData.totalPoints} points</div>
                <div className={`text-2xl font-semibold mb-6 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {percentage.toFixed(1)}%
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Time Taken:</span>
                  <span>{formatTime(quizData.duration * 60 - timeLeft)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => navigate('/academic-ticket/student-dashboard/quiz-results/' + quizId)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Detailed Results
                </button>
                <button
                  onClick={() => navigate('/academic-ticket/student-dashboard/tasks')}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Tasks
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <div className={`flex h-screen ${lightMode ? "bg-white text-black" : "bg-gray-100 text-gray-900"}`}>
      {/* Header */}
      <div className={`${lightMode ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"} p-4 shadow`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{quizData.title}</h1>
            <p className="text-gray-600">{quizData.course}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <Clock size={20} className="text-gray-400" />
              <div className="text-sm font-semibold">{formatTime(timeLeft)}</div>
            </div>
            {!quizStarted ? (
              <button
                onClick={handleStartQuiz}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play size={20} className="mr-2" />
                Start Quiz
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <CheckCircle size={20} className="mr-2" />
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div 
          className="bg-blue-600 h-2 transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Quiz Content */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className={`${lightMode ? "bg-white" : "bg-gray-800"} p-8 rounded-xl shadow`}>
            {/* Question Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Book size={20} className="text-blue-600" />
                <span className="font-semibold">Question {currentQuestion + 1} of {quizData.questions.length}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{quizData.points} points each</span>
                <span>•</span>
                <span>Total: {quizData.totalPoints} points</span>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
              
              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50'
                        : lightMode 
                          ? 'border-gray-300 hover:bg-gray-50'
                          : 'border-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={index}
                      checked={answers[currentQuestion] === index}
                      onChange={() => handleAnswerSelect(currentQuestion, index)}
                      className="mr-3"
                    />
                    <span className="flex-1">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw size={20} className="mr-2" />
                Previous
              </button>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </div>
              
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === quizData.questions.length - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <Play size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
