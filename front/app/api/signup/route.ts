import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { apiUrl } from "@/constants";

export async function POST(request: NextRequest) {
  console.log('=== SIGNUP API ROUTE STARTED ===');
  
  try {
    const formData = await request.json();
    console.log(' Form data received:', formData);

    console.log(' Attempting to connect to:', `${apiUrl}/auth/signup`);

    const backendResponse = await axios.post(`${apiUrl}/auth/signup`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Backend response status:', backendResponse.status);
    console.log('✅ Backend response data:', backendResponse.data);

    return NextResponse.json(backendResponse.data, {
      status: backendResponse.status
    });

  } catch (error) {
    console.error('❌ Error in signup route:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || "Error connecting to backend server";
      const errorData = error.response?.data || { 
        success: false, 
        message: errorMessage 
      };

      console.error('❌ Backend error:', {
        status,
        message: errorMessage,
        data: error.response?.data
      });

      return NextResponse.json(errorData, { status });
    }

    // Handle non-axios errors
    console.error('❌ Non-axios error:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}
