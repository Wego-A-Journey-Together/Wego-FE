import NavBar from '@/components/Nav/NavBar';
import { cn } from '@/lib';
import TanstackProviders from '@/query/TanstackProvider';
import ReduxProvider from '@/redux/ReduxProvider';
import type { Metadata, Viewport } from 'next';
import { Orienta } from 'next/font/google';
import localFont from 'next/font/local';
import { cookies, headers } from 'next/headers';
import React from 'react';
import { Toaster } from 'sonner';

import '../globals.css';

// 로고 타입 글꼴
const orienta = Orienta({
    subsets: ['latin'],
    variable: '--font-orienta',
    weight: '400',
    display: 'swap',
});
// 전역 본문 기본 폰트
const pretendard = localFont({
    src: '../../fonts/PretendardVariable.woff2',
    display: 'swap',
    weight: '45 920',
    variable: '--font-pretendard',
});

export const metadata: Metadata = {
    title: 'Wego',
    description: '국내 여행을 위한 동행 모집 플랫폼입니다.',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    // 다크모드 -> 서버사이드에서 쿠키 읽어오기
    const colorTheme = cookieStore.get('mode');
    // 디폴트 : 라이트모드
    const isDarkMode: boolean = colorTheme?.value === 'dark';

    //----------------------------------------
    // 헤더 lang 에 경로 매핑하기

    // 현재 URL 경로 가져오기
    const headersList = await headers();
    const pathname = headersList.get('x-invoke-path') || '';

    // URL 경로에서 언어 감지
    const pathLocale = pathname.startsWith('/en')
        ? 'en'
        : pathname.startsWith('/ko')
          ? 'ko'
          : '';

    // 쿠키에서 언어 확인 (fallback)
    const localeFromCookie = cookieStore.get('NEXT_LOCALE')?.value;

    // 언어 우선순위: URL 경로 > 쿠키 > 기본값(ko)
    const currentLang = pathLocale || localeFromCookie || 'ko';
    //----------------------------------------

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
            console.log('레이아웃 마운트 user/me 응답:', res);

            if (res.ok) {
                user = await res.json();
                console.log(user);
            } else {
                // 로그인 안된 상태로 처리
                user = null;
                console.log(res);
            }
        } catch (err) {
            // 서버가 죽었거나 네트워크 문제일 경우 ( fetch 는 !res.ok 를 throw 하지 않는다!! ) -> 로그인상태 x
            console.error('user/me 네트워크 오류:', err);
        } finally {
            clearTimeout(beTimeout); // 타이머 클린업
        }
    }

    return (
        <html
            lang={currentLang}
            className={cn(
                pretendard.variable,
                orienta.variable,
                isDarkMode && 'dark',
            )}
        >
            <body className={cn(`font-pretendard bg-custom-light antialiased`)}>
                <ReduxProvider user={user}>
                    <TanstackProviders>
                        <NavBar
                            isDarkMode={isDarkMode}
                            className={`bg-custom-light sticky top-0 z-40`}
                        />
                        <main
                            className={`mx-auto max-w-[1240px] px-4 sm:px-6 md:px-5`}
                        >
                            {children}
                            <Toaster />
                        </main>
                    </TanstackProviders>
                </ReduxProvider>
            </body>
        </html>
    );
}
