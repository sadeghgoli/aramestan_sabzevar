import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userID } = body;

    // Validate required fields
    if (!userID) {
      return NextResponse.json(
        { success: false, error: 'userID is required' },
        { status: 400 }
      );
    }

    // Forward request to external API
    const response = await fetch('http://apikiosk.aramestan.sabzevar.ir/api/basket/read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1',
      },
      body: JSON.stringify({
        userID
      })
    });

    const data = await response.text(); // Get response as text since API returns empty body for success

    // Return response from external API
    if (response.ok) {
      // Try to parse the response if it contains data
      try {
        const responseData = JSON.parse(data);
        return NextResponse.json(responseData, { status: 200 });
      } catch {
        // If response is empty, return success with empty data
        return NextResponse.json({ success: true, data: { items: [] } }, { status: 200 });
      }
    } else {
      // Try to parse error response if available
      try {
        const errorData = JSON.parse(data);
        return NextResponse.json(
          { success: false, error: errorData.error || 'Basket read failed' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { success: false, error: 'Basket read failed' },
          { status: response.status }
        );
      }
    }
  } catch (error) {
    console.error('Basket read proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
