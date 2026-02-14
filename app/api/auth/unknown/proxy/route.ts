import { NextRequest, NextResponse } from 'next/server';

// Generate a proper UUID if needed
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

// Simple token creation using base64 encoding (not as secure as JWT but simpler)
function createSimpleToken(payload: any, secret: string): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + (24 * 60 * 60) // 24 hours
  };
  
  // Use standard base64 encoding and replace URL-unsafe characters
  const encodedHeader = Buffer.from(JSON.stringify(header))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // Create a simple signature (not cryptographically secure, but for demo purposes)
  const signature = Buffer.from(`${encodedHeader}.${encodedPayload}.${secret}`)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
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
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
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
    
    // Get or generate user ID
    const userID = (data.isOK && data.data && data.data.userID) ? data.data.userID : generateUUID();
    
    // Create JWT token for anonymous user
    const token = createSimpleToken({
      userId: userID,
      mobile: 'anonymous',
      deviceID: deviceMAC,
      user: {
        id: userID,
        mobile: 'anonymous',
        name: 'کاربر مهمان'
      }
    }, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    // Set auth token cookie
    unknownResponse.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false, // Set to false for development, change to true in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/'
    });
    
    // Set deviceMAC cookie
    unknownResponse.cookies.set('device-mac', deviceMAC, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });
    
    // Set user ID cookie
    unknownResponse.cookies.set('user-id', userID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });
    
    return unknownResponse;
  } catch (error) {
    console.error('Auth unknown proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}