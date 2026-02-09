import { NextResponse } from 'next/server';

// This is a Route Handler. It runs on the server.
// You can access this at http://localhost:3000/api/hello

export async function GET(request) {
    // You can fetch data from your database here.
    // const data = await db.query(...)

    return NextResponse.json({
        message: 'Hello from the backend!',
        timestamp: new Date().toISOString()
    });
}

export async function POST(request) {
    // Example of handling a POST request with JSON body
    try {
        const body = await request.json();
        return NextResponse.json({
            message: 'Received data successfully',
            data: body
        });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
}
