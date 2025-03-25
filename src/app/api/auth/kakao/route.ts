import { NextRequest, NextResponse } from 'next/server';





export async function POST(req: NextRequest) {
    const SPRING_URI = process.env.SPRING_URI;

    // 선언만 하기
    let kakaoCode: string | undefined;

    // 인가 코드 꺼내기
    try {
        //할당
        kakaoCode = (await req.json()).code;

        if (!kakaoCode) {
            return NextResponse.json(
                { message: '인가 코드 없음' },
                { status: 400 },
            );
        }
    } catch (err) {
        console.error('JSON 파싱 실패:', err);
        return NextResponse.json(
            { message: '잘못된 요청입니다.' },
            { status: 400 },
        );
    }

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
