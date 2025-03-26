import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * 카카오 소셜 로그인에 필요한 데이터를 만들고
 * state를 쿠키에 저장시킨 이후에 유저를 카카오
 * @constructor
 */
export async function GET() {
    // 환경 변수 로드
    const KAKAO_REST_API = process.env.KAKAO_REST_API;
    const CALLBACK_PATH = process.env.CALLBACK_PATH;
    const FE_URI = process.env.FE_URI;

    if (!KAKAO_REST_API || !CALLBACK_PATH || !FE_URI) {
        console.error('ENV 체크 하세요');
        return NextResponse.json(
            { message: '서버 구성 오류가 발생했습니다.' },
            { status: 500 },
        );
    }

    // RedirectUri 설정
    const REDIRECT_URI = `${FE_URI}${CALLBACK_PATH}`;

    // 잠시 고유값이면 되니까 가장 가벼운 나노아이디로 설정했습니다.
    const state = nanoid();

    try {
        //카카오 주소와 쿼리정보 추가하
        const kakaoAuthURL = new URL('https://kauth.kakao.com/oauth/authorize');
        kakaoAuthURL.searchParams.append('client_id', KAKAO_REST_API);
        kakaoAuthURL.searchParams.append('redirect_uri', REDIRECT_URI);
        kakaoAuthURL.searchParams.append('response_type', 'code');
        kakaoAuthURL.searchParams.append('state', state);

        // HttpOnly 쿠키 세팅
        const cookie = await cookies();
        cookie.set('kakao_auth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 300,
            path: '/',
        });

        // 유저를 카카오 로그인 창으로 푸시
        return NextResponse.redirect(kakaoAuthURL.toString());
    } catch (err) {
        console.error('카카오 인증 URL 생성 오류:', err);
        return NextResponse.json(
            { message: '인증 처리 중 오류가 발생했습니다.' },
            { status: 500 },
        );
    }
}
