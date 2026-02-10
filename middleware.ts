import { NextRequest, NextResponse } from 'next/server';

// Simple token verification (not as secure as proper JWT verification)
function verifySimpleToken(token: string, secret: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    
    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected routes
  const protectedRoutes = ['/dashboard'];
  
  // Check if the current path is a protected route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      // Redirect to login page if no token
      return NextResponse.redirect(new URL('/phone-input', request.url));
    }
    
    // Verify token
    const payload = verifySimpleToken(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    if (!payload) {
      // Redirect to login page if token is invalid
      return NextResponse.redirect(new URL('/phone-input', request.url));
    }
    
    // Add user info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-mobile', payload.mobile);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};