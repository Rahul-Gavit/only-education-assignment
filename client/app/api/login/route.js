// api/login/route.js
import { NextResponse } from "next/server";
import axios from "axios";

const URL = process.env.URL;

export async function POST(req) {
  try {
    const body = await req.json();
    const response = await axios.post(`${URL}/api/auth/login`, body); // Replace with your backend login API URL

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Error in /api/login:", error);
    return NextResponse.json(
      { message: error.response?.data?.message || "Login failed" },
      { status: error.response?.status || 500 }
    );
  }
}
