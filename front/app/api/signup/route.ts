import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('=== SIGNUP API ROUTE STARTED ===');
  
  try {
    const formData = await request.json();
    console.log('✅ Form data received:', formData);

    // Verificar que el backend esté corriendo
    const BACKEND_URL = 'http://localhost:4000/api/auth/signup'; // Cambia el puerto si es necesario
    console.log('🚀 Attempting to connect to:', BACKEND_URL);

    const backendResponse = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    console.log('📡 Backend response status:', backendResponse.status);
    console.log('📡 Backend response ok:', backendResponse.ok);
    
    const responseText = await backendResponse.text();
    console.log('📡 Backend response text (first 300 chars):', responseText.substring(0, 300));

    // Intentar parsear como JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ JSON parsed successfully:', data);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('❌ Response was:', responseText);
      
      return NextResponse.json({
        success: false,
        message: "El servidor backend devolvió una respuesta inválida",
        debug: {
          status: backendResponse.status,
          responsePreview: responseText.substring(0, 200)
        }
      }, { status: 500 });
    }
    
    console.log('✅ Returning data to frontend:', data);
    return NextResponse.json(data, { 
      status: backendResponse.status 
    });

  } catch (error) {
    console.error('❌ MAJOR ERROR in signup route:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({
      success: false,
      message: "Error conectando con el servidor",
      error: error.message
    }, { status: 500 });
  }
}