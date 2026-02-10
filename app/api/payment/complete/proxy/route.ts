import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userID, paymentID, payMethod, payCode, payDescription, paiedPrice } = body;

    // Validate required fields
    if (!userID || !paymentID || !payMethod || !payCode || !payDescription || !paiedPrice) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Forward request to external API
    const response = await fetch('http://apikiosk.aramestan.sabzevar.ir/api/payment/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1',
      },
      body: JSON.stringify({
        userID,
        paymentID,
        payMethod,
        payCode,
        payDescription,
        paiedPrice
      })
    });

    const data = await response.json();
    console.log('Payment Complete API Response:', data);

    // Return response from external API
    return NextResponse.json(data, { 
      status: response.status 
    });
  } catch (error) {
    console.error('Payment complete proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}