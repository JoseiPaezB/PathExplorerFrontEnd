import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { apiUrl } from "@/constants";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { message: "No authorization token provided" },
        { status: 401 }
      );
    }

    const backendResponse = await axios.get(`${apiUrl}/dashboard`, {
      headers: {
        Authorization: token,
      },
    });

    return NextResponse.json(backendResponse.data);
  } catch (error) {
    console.error("Error proxying request to backend:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message || "Error connecting to backend server";
      return NextResponse.json({ message: errorMessage }, { status });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
