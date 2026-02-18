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
    const { mobile, otpCode } = body;
    
    // Debug logging
    console.log('Verify request body:', { mobile, otpCode, typeOfOtpCode: typeof otpCode });
    console.log('Request headers:', {
      'Content-Type': 'application/json',
      'app-version': '1',
    });
    console.log('Request URL:', 'http://apikiosk.aramestan.sabzevar.ir/api/auth/verify');

    // Validate required fields
    if (!mobile || !otpCode) {
      console.log('Validation failed:', { mobile: !!mobile, otpCode: !!otpCode });
      return NextResponse.json(
        { success: false, error: 'mobile and otpCode are required' },
        { status: 400 }
      );
    }

    // Forward request to external API
    let response;
    try {
      const requestBody = JSON.stringify({
        mobile,
        otpCode: Number(otpCode) // Ensure otpCode is sent as a number
      });
      
      console.log('Request body being sent:', requestBody);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'app-version': '1',
      });
      
      response = await fetch('http://apikiosk.aramestan.sabzevar.ir/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'app-version': '1',
        },
        body: requestBody
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to connect to external API' },
        { status: 500 }
      );
    }

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      return NextResponse.json(
        { success: false, error: `HTTP error! status: ${response.status}, message: ${errorText}` },
        { status: 500 }
      );
    }

    const responseText = await response.text();
    
    // Handle empty response
    if (!responseText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Empty response from server' },
        { status: 500 }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError);
      console.error('Response text:', responseText);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON response from server' },
        { status: 500 }
      );
    }
    

    // Check if verification was successful
    if (data.isOK && data.data) {
      // Create JWT token
      const token = createSimpleToken({
        userId: data.data.userID,
        mobile: mobile,
        user: {
          id: data.data.userID,
          mobile: mobile
        }
      }, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      
      // Store user ID separately
      const userId = data.data.userID;
      
      // Set both JWT token and user ID in cookies
      const successResponse = NextResponse.json({
        success: true,
        data: {
          user: {
            id: data.data.userID,
            mobile: mobile,
            name: data.data.user?.name
          }
        }
      });
      
      // Set JWT token
      successResponse.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: false, // موقتاً true را بردارید تا روی HTTP کار کند
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/'
      });
      
      // Set user ID separately
      successResponse.cookies.set('user-id', userId, {
        httpOnly: true,
        secure: false, // موقتاً true را بردارید تا روی HTTP کار کند
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/'
      });

      return successResponse;
    } else {
      // Return error response from API
      return NextResponse.json({
        success: false,
        error: data.stateDescription || 'Verification failed'
      }, {
        status: 200 // Keep status 200 to ensure proper error handling
      });
    }
  } catch (error) {
    console.error('Auth verify proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}