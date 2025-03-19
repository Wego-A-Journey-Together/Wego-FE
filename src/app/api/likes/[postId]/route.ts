import { NextRequest, NextResponse } from 'next/server';





type Params = { postId: string };

interface ApiRouteProps {
    params: Promise<Params>;
}

/*
 * todo: 모킹된 api 입니다 .bff 로 전환하거나, 제거해야 합니다 .
 */
export async function PATCH(req: NextRequest, { params }: ApiRouteProps) {
    try {
        const { postId } = await params;
        const data = await req.json();
        if (!data || data.like == null) {
            return NextResponse.json(
                { error: 'like is required' },
                { status: 400 },
            );
        }
        return NextResponse.json(
            {
                success: true,
                postId: postId, // 경로 파라미터
                receivedLike: data.like, // 클라이언트가 보낸 최종 상태
            },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to process PATCH request', detail: String(err) },
            { status: 400 },
        );
    }
}
