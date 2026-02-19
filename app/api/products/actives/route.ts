import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Forward request to external API
    const response = await fetch('/proxy/api/products/actives', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.text(); // Get response as text since API returns empty body for success

    // Return response from external API
    if (response.ok) {
      // Try to parse response if it contains data
      try {
        const responseData = JSON.parse(data);
        
        // Transform the response to match frontend expectations
        if (responseData.isOK && responseData.data) {
          // Transform productID to id for frontend compatibility
          const products = responseData.data.map((product: any) => ({
            ...product,
            id: product.productID
          }));
          
          return NextResponse.json({
            success: true,
            data: { products }
          }, { status: 200 });
        } else {
          // If response doesn't have expected structure, return empty products
          return NextResponse.json({ success: true, data: { products: [] } }, { status: 200 });
        }
      } catch {
        // If response is empty, return success with empty data
        return NextResponse.json({ success: true, data: { products: [] } }, { status: 200 });
      }
    } else {
      // Try to parse error response if available
      try {
        const errorData = JSON.parse(data);
        return NextResponse.json(
          { success: false, error: errorData.error || errorData.stateDescription || 'Products actives failed' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { success: false, error: 'Products actives failed' },
          { status: response.status }
        );
      }
    }
  } catch (error) {
    console.error('Products actives proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
