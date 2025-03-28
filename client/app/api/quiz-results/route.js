import { NextResponse } from "next/server";
import axios from "axios";

const URL = process.env.URL;

export async function POST(req) {
  try {
    const { quizId, score, totalMarks, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID missing" }, { status: 400 });
    }

    const backendResponse = await axios.post(
      `${URL}/api/quizzes/quiz-results`,
      {
        quizId: quizId,
        userId: userId,
        score: score,
        totalMarks: totalMarks,
      }
    );

    return NextResponse.json(backendResponse.data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Failed to save quiz result",
      },
      { status: error.response?.status || 500 }
    );
  }
}
