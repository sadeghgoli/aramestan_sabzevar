import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userID, items } = body;
    
    // Get device MAC from header
    const deviceMAC = request.headers.get('X-Device-MAC') || '5C-9A-D8-58-81-95';
    console.log('Using deviceMAC from header:', deviceMAC);

    // Validate required fields
    if (!userID || !items) {
      return NextResponse.json(
        { success: false, error: 'userID and items are required' },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'items must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.productID || !item.count || item.count <= 0) {
        return NextResponse.json(
          { success: false, error: 'Each item must have productID and positive count' },
          { status: 400 }
        );
      }
    }

    // Forward request to external API
    const response = await fetch('http://apikiosk.aramestan.sabzevar.ir/api/basket/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1',
      },
      body: JSON.stringify({
        deviceID: deviceMAC,
        userID,
        items
      })
    });

    const data = await response.text(); // Get response as text since the API returns empty body for success

    // Return response from external API
    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // Try to parse error response if available
      try {
        const errorData = JSON.parse(data);
        return NextResponse.json(
          { success: false, error: errorData.error || 'Basket save failed' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { success: false, error: 'Basket save failed' },
          { status: response.status }
        );
      }
    }
  } catch (error) {
    console.error('Basket save proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
