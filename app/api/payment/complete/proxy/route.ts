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
    const response = await fetch('/api/payment/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        message: 'Payment completed successfully'
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