"use client";
import { useState, useEffect } from "react";
import { Trophy, Filter, SortAsc, SortDesc, ArrowLeft } from "lucide-react";
import Link from "next/link";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortDirection, setSortDirection] = useState("desc");
  const [filterQuiz, setFilterQuiz] = useState("");

  // Get unique quiz titles for filtering
  const uniqueQuizTitles = [
    ...new Set(
      leaderboardData.flatMap((entry) =>
        entry.quizEntries.map((quizEntry) => quizEntry.quizTitle)
      )
    ),
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        setLeaderboardData(users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Sorting and filtering logic
  const processedData = leaderboardData
    .map((entry) => ({
      ...entry,
      quizEntries: entry.quizEntries.filter(
        (quiz) => !filterQuiz || quiz.quizTitle === filterQuiz
      ),
    }))
    .filter((entry) => entry.quizEntries.length > 0)
    .sort((a, b) => {
      const aScore = a.quizEntries[0]?.score || 0;
      const bScore = b.quizEntries[0]?.score || 0;
      return sortDirection === "desc" ? bScore - aScore : aScore - bScore;
    });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Trophy className="mx-auto w-16 h-16 text-blue-500 animate-pulse" />
          <p className="mt-4 text-xl text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-500 mb-4">
            <Trophy className="mx-auto w-16 h-16" />
          </div>
          <p className="text-xl text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="">
              <Link
                href="/dashboard"
                className="mr-4 flex bg-blue-400 px-2 rounded-lg py-1"
              >
                <ArrowLeft className="w-6 h-6 pr-1" /> Back
              </Link>
            </div>

            <h2 className="text-2xl font-bold flex items-center">
              <Trophy className="mr-3 w-8 h-8" />
              Leaderboard
            </h2>
          </div>

          {/* Filtering and Sorting Controls */}
          <div className="flex space-x-2">
            {/* Quiz Filter */}
            <select
              value={filterQuiz}
              onChange={(e) => setFilterQuiz(e.target.value)}
              className="bg-white/20 focus:outline-none rounded px-2 py-1 text-sm"
            >
              <option className="focus:outline-none hover:bg-gray-300" value="">
                All Quizzes
              </option>
              {uniqueQuizTitles.map((title) => (
                <option
                  className="bg-gray-500 hover:bg-gray-300"
                  key={title}
                  value={title}
                >
                  {title}
                </option>
              ))}
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() =>
                setSortDirection(sortDirection === "desc" ? "asc" : "desc")
              }
              className="bg-white/20 rounded p-1 hover:bg-white/30 transition"
            >
              {sortDirection === "desc" ? (
                <SortDesc className="w-5 h-5" />
              ) : (
                <SortAsc className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Leaderboard Content */}
        {processedData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="mx-auto w-16 h-16 mb-4 text-gray-300" />
            <p>No leaderboard data available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processedData.map((entry, index) => {
                  const rowSpan = entry.quizEntries.length;
                  return entry.quizEntries.map((quizEntry, quizIndex) => (
                    <tr
                      key={`${index}-${quizIndex}`}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      {quizIndex === 0 && (
                        <>
                          <td
                            className={`px-4 py-4 whitespace-nowrap font-bold 
                                ${
                                  index === 0
                                    ? "text-yellow-600"
                                    : index === 1
                                    ? "text-gray-500"
                                    : index === 2
                                    ? "text-orange-600"
                                    : "text-gray-700"
                                }`}
                            rowSpan={rowSpan}
                          >
                            {index + 1}
                          </td>
                          <td
                            className="px-4 py-4 whitespace-nowrap font-medium text-gray-900"
                            rowSpan={rowSpan}
                          >
                            {entry.userName}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                        {quizEntry.quizTitle}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-800 font-semibold">
                        {quizEntry.score} / {quizEntry.totalMarks}
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
