import { NextResponse } from "next/server";
import axios from "axios";

const URL = process.env.URL;

export async function GET() {
  try {
    const response = await axios.get(`${URL}/api/user/leaderboard`);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      {
        message: error.response?.data?.message || "Failed to fetch leaderboard",
      },
      { status: error.response?.status || 500 }
    );
  }
}
