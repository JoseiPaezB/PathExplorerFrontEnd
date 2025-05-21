import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// This is a Next.js App Router API route that acts as a proxy to your backend
export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header from the incoming request
    const token = request.headers.get('authorization');

    if (!token) {
      return NextResponse.json(
        { message: 'No authorization token provided' },
        { status: 401 }
      );
    }

    // Forward the request to your backend
    const backendResponse = await axios.get('http://localhost:4000/api/dashboard', {
      headers: {
        Authorization: token,
      }
    });

    // Return the data from your backend
    return NextResponse.json(backendResponse.data);
  } catch (error) {
    console.error('Error proxying request to backend:', error);
    
    if (axios.isAxiosError(error)) {
      // Forward the status and error message from the backend
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || 'Error connecting to backend server';
      return NextResponse.json(
        { message: errorMessage },
        { status }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}