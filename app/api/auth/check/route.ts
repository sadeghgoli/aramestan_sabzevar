import { NextRequest, NextResponse } from 'next/server';

// Simple token verification (not as secure as proper JWT verification)
function verifySimpleToken(token: string, secret: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Add padding back to base64 string if needed
    let payloadBase64 = parts[1];
    while (payloadBase64.length % 4) {
      payloadBase64 += '=';
    }
    
    // Replace URL-safe characters back to standard base64
    payloadBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    
    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user ID from dedicated cookie
    const userId = request.cookies.get('user-id')?.value;
    
    if (!userId) {
      return NextResponse.json({ authenticated: '11false' });
    }
    
    // Return user ID from cookie
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userId
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: 'false' });
  }
}