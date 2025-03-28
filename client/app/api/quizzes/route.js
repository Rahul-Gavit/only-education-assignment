// api/quizzes/route.js
import { NextResponse } from "next/server";
import axios from "axios";
const URL = process.env.URL;

export async function GET(req) {
  try {
    const response = await axios.get(`${URL}/api/quizzes`); // Replace with your backend quizzes API URL
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Error in /api/quizzes:", error);
    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch quizzes" },
      { status: error.response?.status || 500 }
    );
  }
}
