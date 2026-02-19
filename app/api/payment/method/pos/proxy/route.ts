import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentID } = body;
    
    // Validate required fields
    if (!paymentID) {
      return NextResponse.json(
        { success: false, error: 'paymentID is required' },
        { status: 400 }
      );
    }

    // Forward request to external API
    const response = await fetch('http://apikiosk.aramestan.sabzevar.ir/api/payment/method/pos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentID
      })
    });

    // Check if response is JSON or binary data
    const contentType = response.headers.get('content-type');
    console.log('Response content-type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      // JSON response
      const data = await response.json();
      console.log('POS API Response:', data);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      // Return response from external API
      return NextResponse.json(data, { 
        status: response.status 
      });
    } else {
      // Binary response (likely an image)
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${contentType};base64,${base64}`;
      
      console.log('POS API returned image data');
      
      // Return the image data as JSON
      return NextResponse.json({
        success: true,
        data: {
          qrCode: dataUrl
        }
      }, { 
        status: response.status 
      });
    }
  } catch (error) {
    console.error('Payment method POS proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}