import NavBar from '@/components/Nav/NavBar';
import LoginModal from '@/components/common/LoginModal';
import { cn } from '@/lib';
import getCurrentUser from '@/lib/getCurrentUser';
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

    const user = await getCurrentUser();

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
                <ReduxProvider user={user} locale={currentLang}>
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
                            <LoginModal />
                        </main>
                    </TanstackProviders>
                </ReduxProvider>
            </body>
        </html>
    );
}
