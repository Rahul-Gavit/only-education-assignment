"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import QuizCard from "../components/QuizCard";
import axios from "axios";
import { RefreshCw, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("/api/quizzes");
        setQuizzes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch quizzes");
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchQuizzes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-blue-500">
          Live Quizzes
        </h1>

        {loading && (
          <div className="flex justify-center items-center space-x-3 py-8">
            <RefreshCw className="animate-spin text-blue-600" size={32} />
            <p className="text-lg text-blue-800">Loading quizzes...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="text-red-500" size={48} />
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="mx-auto flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {!loading && !error && quizzes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600">No live quizzes available.</p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later or create a new quiz!
            </p>
          </div>
        )}

        {!loading && !error && quizzes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
