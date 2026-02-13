import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentID } = body;
    
    // Get device MAC from header
    const deviceMAC = request.headers.get('X-Device-MAC') || '5C-9A-D8-58-81-95';
    console.log('Using deviceMAC from header:', deviceMAC);
    console.log('Barcode proxy request body:', body);

    // Validate required fields
    if (!deviceMAC || !paymentID) {
      return NextResponse.json(
        { success: false, error: 'deviceMAC and paymentID are required' },
        { status: 400 }
      );
    }

    // Forward request to external API
    const response = await fetch('http://apikiosk.aramestan.sabzevar.ir/api/payment/method/barcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1',
        'X-Device-MAC': deviceMAC,
      },
      body: JSON.stringify({
        deviceID: deviceMAC,
        paymentID
      })
    });

    // Check if response is JSON or binary data
    const contentType = response.headers.get('content-type');
    console.log('Response content-type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      // JSON response
      const data = await response.json();
      console.log('Barcode API Response:', data);
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
      
      console.log('Barcode API returned image data');
      
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
    console.error('Payment method barcode proxy error:', error);
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