import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
        return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }

    try {
        return NextResponse.json({ wsToken: accessToken.value });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
