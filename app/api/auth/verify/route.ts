import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceID, mobile, otpCode } = body;

    // Validate required fields
    if (!deviceID || !mobile || !otpCode) {
      return NextResponse.json(
        { success: false, error: 'deviceID, mobile and otpCode are required' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Verify OTP code against stored value
    // 2. Check if OTP is not expired
    // 3. Get or create user record
    // 4. Generate authentication token

    // For demo purposes, we'll accept any OTP code and simulate success
    const mockResponse = {
      success: true,
      data: {
        userID: 'demo-user-id-123',
        token: 'demo-jwt-token-123',
        user: {
          name: 'کاربر دمو',
          mobile: mobile
        }
      }
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Auth verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
