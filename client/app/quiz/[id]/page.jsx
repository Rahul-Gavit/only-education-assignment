"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

const QuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(30);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  // const [currentFeedback, setCurrentFeedback] = useState(null);
  const router = useRouter();

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${id}`);
        setQuiz(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch quiz");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Timer and auto-next question logic
  useEffect(() => {
    if (timer > 0 && !quizFinished) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (!quizFinished) {
      handleNextQuestion();
    }
  }, [timer, quizFinished]);

  // Option selection handler with immediate feedback
  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    // Provide immediate feedback
    const isCorrect =
      option === quiz.questions[currentQuestionIndex].correctAnswer;
    // setCurrentFeedback({
    //   isCorrect,
    //   message: isCorrect
    //     ? "Correct! Great job!"
    //     : `Oops! The correct answer was: ${quiz.questions[currentQuestionIndex].correctAnswer}`,
    // });
    // setShowFeedback(true);

    // Auto-hide feedback after 2 seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };

  // Next question handler
  const handleNextQuestion = useCallback(() => {
    // Record the user's answer
    setUserAnswers((prev) => [
      ...prev,
      {
        question: quiz.questions[currentQuestionIndex].questionText,
        selectedAnswer: selectedOption,
        correctAnswer: quiz.questions[currentQuestionIndex].correctAnswer,
      },
    ]);

    // Reset for next question
    setSelectedOption(null);
    setTimer(30);
    setShowFeedback(false);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateScore();
    }
  }, [quiz, currentQuestionIndex, selectedOption]);

  // Score calculation and result saving
  const calculateScore = async () => {
    let score = 0;
    userAnswers.forEach((answer) => {
      if (answer.selectedAnswer === answer.correctAnswer) {
        score++;
      }
    });

    setFinalScore(score);
    setQuizFinished(true);

    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        setError("User data not found. Please log in again.");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user.id;

      if (!userId) {
        setError("User ID not found in local storage.");
        return;
      }

      await axios.post(`/api/quiz-results`, {
        quizId: id,
        score: score,
        totalMarks: quiz.questions.length,
        userId: userId,
      });
    } catch (err) {
      console.error("Failed to save quiz result:", err);
      setError("Failed to save quiz result. Please try again.");
    }
  };

  // Loading and error states
  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="text-2xl font-bold text-blue-600"
        >
          Loading Quiz...
        </motion.div>
      </motion.div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <XCircle className="mx-auto mb-4 text-red-500" size={64} />
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );

  if (!quiz) return null;

  // Quiz finished state
  if (quizFinished) {
    const totalMarks = quiz.questions.length;
    const passingMarks = Math.ceil(totalMarks / 4);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Quiz Results</h2>
          <div className="flex justify-center mb-4">
            {finalScore >= passingMarks ? (
              <CheckCircle2 className="text-green-600" size={64} />
            ) : (
              <XCircle className="text-red-600" size={64} />
            )}
          </div>
          <p className="mb-2 text-center">
            Quiz: <span className="font-semibold">{quiz.title}</span>
          </p>
          <p className="mb-2 text-center">
            Your Score:{" "}
            <span className="font-semibold">
              {finalScore} / {totalMarks}
            </span>
          </p>
          <p className="mb-4 text-center">
            Passing Marks: <span className="font-semibold">{passingMarks}</span>
          </p>
          {finalScore >= passingMarks ? (
            <p className="text-green-600 font-semibold text-center">
              Congratulations! You passed the quiz.
            </p>
          ) : (
            <p className="text-red-600 font-semibold text-center">
              Try again. You need more practice.
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
          >
            Back to Dashboard
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Active quiz state
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-4"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <div className="flex items-center">
            <Clock className="mr-2 text-blue-600" size={20} />
            <span
              className={`font-semibold ${
                timer <= 10 ? "text-red-500" : "text-blue-600"
              }`}
            >
              {timer} sec
            </span>
          </div>
        </div>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <p className="font-semibold mb-2">
            Question {currentQuestionIndex + 1} / {quiz.questions.length}:
          </p>
          <p className="text-lg">{currentQuestion.questionText}</p>
        </motion.div>

        <div className="mb-4">
          {currentQuestion.options.map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionSelect(option)}
              className={`block w-full p-3 border rounded mb-2 transition-all duration-300 ${
                selectedOption === option
                  ? "bg-blue-200 hover:bg-blue-300"
                  : "hover:bg-gray-100"
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showFeedback && currentFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 rounded mb-4 text-center ${
                currentFeedback.isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {currentFeedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors duration-300"
            disabled={timer > 0 && selectedOption === null}
          >
            Next Question
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizPage;
