import { NextResponse } from 'next/server';





export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filters = searchParams.get('filters');

    console.log(filters);

    const response = await fetch(

        `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/filter?filters=${filters}`,

    );
    const data = await response.json();

    console.log(data);

    return NextResponse.json(data);
}
