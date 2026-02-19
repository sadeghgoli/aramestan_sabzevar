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
      },
      body: JSON.stringify({
        paymentID,
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
        message: 'Payment check processed successfully'
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