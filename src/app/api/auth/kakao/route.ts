import { NextRequest, NextResponse } from 'next/server';





export async function POST(req: NextRequest) {
    const SPRING_URI = process.env.SPRING_URI;
    // 인가 코드 꺼내기
    const kakaoCode = (await req.json()).code;

    // 없으면 에러
    if (!kakaoCode) return NextResponse.error();

    try {
        //todo 실제 백엔드에서 인가코드 받을 주소로 세팅 해야함
        const res = await fetch(`${SPRING_URI}/api/user/kakao/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ kakaoCode }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { message: data?.message || '로그인 실패' },
                { status: res.status },
            );
        }
        // todo 어떤 방식으로 유저에게 세션을 제공할지 아직몰라용
        return NextResponse.json({ message: '로그인 성공' });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: '서버 내부 오류 발생' },
            { status: 500 },
        );
    }
}
