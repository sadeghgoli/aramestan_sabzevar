import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentID, userID } = body;

    // Validate required fields
    if (!paymentID || !userID) {
      return NextResponse.json(
        { success: false, error: 'paymentID and userID are required' },
        { status: 400 }
      );
    }

    // Forward request to external API
    const response = await fetch('http://apikiosk.aramestan.sabzevar.ir/api/payment/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1',
      },
      body: JSON.stringify({
        paymentID,
        userID
      })
    });

    const data = await response.json();
    console.log('Payment Check API Response:', data);

    // Return response from external API
    return NextResponse.json(data, { 
      status: response.status 
    });
  } catch (error) {
    console.error('Payment check proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}