// components/QuizCard.js
import React from "react";
import Link from "next/link";

const QuizCard = ({ quiz }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
      <p className="text-gray-600">{quiz.questions.length} Questions</p>
      <Link
        href={`/quiz/${quiz._id}`}
        className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Quiz
      </Link>
    </div>
  );
};

export default QuizCard;
