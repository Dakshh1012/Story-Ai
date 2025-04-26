import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Make request to external API from the server-side
    const response = await fetch('https://abe3-103-104-226-58.ngrok-free.app/generate_mystery', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({ error: `API error: ${response.status} ${response.statusText}` }),
        { status: 500 }
      );
    }

    // Check content type to handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new NextResponse(
        JSON.stringify({ error: 'External API returned non-JSON response' }),
        { status: 500 }
      );
    }

    // Forward the external API response to the client
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating mystery:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate mystery' }),
      { status: 500 }
    );
  }
}
