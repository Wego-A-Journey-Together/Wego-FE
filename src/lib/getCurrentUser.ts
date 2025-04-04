import { headers } from 'next/headers';

export interface CurrentUser {
    kakaoId: string;
    nickname: string;
    email: string;
}

export default async function getCurrentUser(): Promise<
    CurrentUser | undefined
> {
    //-------------------유저 정보 SSR ----------------------------
    const controller = new AbortController();
    const NEST_BFF_URL =
        process.env.NEXT_BFF_URL || 'https://gateway.wego-travel.click';
    let user = null;

    // dev 모드가 활성화되어 있는 경우
    if (process.env.NODE_ENV === 'development') {
        user = {
            kakaoId: 'drill',
            nickname: '김드릴',
            email: 'guest@example.com',
        };
        console.log('DEV 모드로 동작 중:', user);
        return user;
    } else {
        // 일반 모드: 실제 API 호출
        // vercel 504 에러를 막기 위해 서버가 내려간 경우 AbortController 타이머 등록
        const beTimeout = setTimeout(() => {
            controller.abort();
        }, 3000);

        try {
            const res = await fetch(`${NEST_BFF_URL}/api/user/me`, {
                headers: {
                    cookie: (await headers()).get('cookie') || '',
                },
                cache: 'no-store',
                //컨트롤러 등록
                signal: controller.signal,
            });

            if (res.ok) {
                user = await res.json();
            } else {
                // 로그인 안된 상태로 처리
                user = null;
            }
        } catch (err) {
            // 서버가 죽었거나 네트워크 문제일 경우 ( fetch 는 !res.ok 를 throw 하지 않는다!! ) -> 로그인상태 x
            console.debug('user/me 네트워크 오류:', err);
        } finally {
            clearTimeout(beTimeout); // 타이머 클린업
        }
        return user ?? undefined;
    }
}
