import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userID, deviceID } = body;

    console.log('Basket proxy request body:', body);

    // Validate required fields
    if (!userID) {
      return NextResponse.json(
        { success: false, error: 'userID is required' },
        { status: 400 }
      );
    }

    // Forward request to external API
    const response = await fetch('http://apikiosk.aramestan.sabzevar.ir/api/payment/basket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1',
      },
      body: JSON.stringify({
        userID
      })
    });

    const data = await response.json();
    console.log('Payment Basket API Response:', data);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    // Return response from external API
    return NextResponse.json(data, { 
      status: response.status 
    });
  } catch (error) {
    console.error('Payment basket proxy error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}