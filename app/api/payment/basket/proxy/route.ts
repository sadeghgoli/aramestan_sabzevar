import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userID } = body;
    
    // Get device MAC from header
    const deviceMAC = request.headers.get('X-Device-MAC') || '5C-9A-D8-58-81-95';
    console.log('Using deviceMAC from header:', deviceMAC);
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
        'X-Device-MAC': deviceMAC,
      },
      body: JSON.stringify({
        userID
      })
    });

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const responseText = await response.text();
    
    // Handle empty response
    if (!responseText.trim()) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Payment basket processed successfully'
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Invalid JSON response from server');
    }
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