// api/quizzes/[id]/route.js
import { NextResponse } from "next/server";
import axios from "axios";
const URL = process.env.URL;

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const response = await axios.get(`${URL}/api/quizzes/${id}`); // Replace with your backend quizzes API URL
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Error in /api/quizzes/[id]:", error);
    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch quiz" },
      { status: error.response?.status || 500 }
    );
  }
}
