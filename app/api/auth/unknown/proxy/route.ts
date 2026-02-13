import { NextRequest, NextResponse } from 'next/server';

// Generate a proper UUID if needed
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get device MAC from header
    const deviceMAC = request.headers.get('X-Device-MAC') || '5C-9A-D8-58-81-95';
    console.log('Using deviceMAC from header:', deviceMAC);

    // Validate required fields
    if (!deviceMAC) {
      return NextResponse.json(
        { success: false, error: 'deviceMAC is required' },
        { status: 400 }
      );
    }

    // Forward request to external API
    const response = await fetch('http://apikiosk.aramestan.sabzevar.ir/api/auth/unknown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1',
        'X-Device-MAC': deviceMAC,
      },
      body: JSON.stringify({
        deviceID: deviceMAC
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
      // Return success for empty response (API might not return content for unknown request)
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Unknown user created successfully'
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

    // Return response from external API
    const unknownResponse = NextResponse.json({
      success: data.isOK !== undefined ? data.isOK : true,
      data: data.data || null,
      error: data.stateDescription || null
    }, {
      status: response.status
    });
    
    // Set deviceMAC cookie
    unknownResponse.cookies.set('device-mac', deviceMAC, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });
    
    // Set user ID cookie if response contains userID
    if (data.isOK && data.data && data.data.userID) {
      unknownResponse.cookies.set('user-id', data.data.userID, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      });
    }
    
    return unknownResponse;
  } catch (error) {
    console.error('Auth unknown proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}