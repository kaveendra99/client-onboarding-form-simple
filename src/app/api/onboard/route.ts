import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get the submitted data
    const data = await request.json();
    console.log('Mock API received:', data);

    // Return a mock success response
    return NextResponse.json({
      status: 'success',
      message: 'Form submitted successfully (mock response)',
      data: data
    }, { status: 200 });

  } catch (error) {
    console.error('Mock API error:', error);
    return NextResponse.json(
      { error: 'Mock API error - check server logs' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';