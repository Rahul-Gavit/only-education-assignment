import { NextResponse } from "next/server";
import axios from "axios";
const URL = process.env.URL;

export async function POST(req) {
  try {
    const body = await req.json();
    const response = await axios.post(`${URL}/api/auth/signup`, body); // Replace with your actual backend API URL

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Error in /api/signup:", error);
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "An unexpected error occurred.",
      },
      { status: error.response?.status || 500 }
    );
  }
}
