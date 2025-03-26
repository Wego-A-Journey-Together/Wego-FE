import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * redirect uri 에서 인가코드를 뽑아 BE로 전달하는 route
 * @param req
 * @constructor
 */
export async function POST(req: NextRequest) {
    const SPRING_URI = process.env.SPRING_URI;
    const BE_KAKAO_CODE_URI = process.env.BE_KAKAO_CODE_URI;

    // 선언만 하기
    let code: string | undefined;
    let state: string | undefined;

    // 인가 코드 꺼내기 && state 값 검증
    try {
        //할당
        ({ code, state } = await req.json());

        if (!code) {
            return NextResponse.json(
                { message: '인가 코드 없음' },
                { status: 400 },
            );
        }
        const userCookie = await cookies();
        const originState = userCookie.get('kakao_auth_state');

        // state 가 없거나, 쿠키에 state 가 없다면 비정상 접근 처리
        if (!(originState && state)) {
            return NextResponse.json(
                { message: '비정상 접근 입니다.' },
                { status: 400 },
            );
        }

        // state 가 올바르게 도착 했는지 검증
        if (originState.value !== state) {
            return NextResponse.json(
                { message: '인증 정보가 유효하지 않습니다' },
                { status: 400 },
            );
        }
        // 쿠키 지우기 ( 인가코드 전달을 위한 쿠키 이므로 )
        userCookie.delete('kakao_auth_state');
    } catch (err) {
        console.error('JSON 파싱 실패:', err);
        return NextResponse.json(
            { message: '잘못된 요청입니다.' },
            { status: 400 },
        );
    }

    try {
        //todo 실제 백엔드에서 인가코드 받을 주소로 세팅 해야함
        const res = await fetch(`${SPRING_URI}${BE_KAKAO_CODE_URI}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
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
