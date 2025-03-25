import { NextRequest, NextResponse } from 'next/server';





export async function POST(req: NextRequest) {
    // 인가 코드 꺼내기
    const kakaoCode = (await req.json()).code;

    const SPRING_URI = process.env.SPRING_URI;
    // 없으면 에러
    if (!kakaoCode) return NextResponse.error();

    try {
        //todo 실제 백엔드에서 인가코드 받을 주소로 세팅 해야함
        const res = await fetch(`${SPRING_URI}/api/user/kakao/callback`, {});
    } catch (err) {}
}
