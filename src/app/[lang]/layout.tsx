import NavBar from '@/components/Nav/NavBar';
import ThemeToggler from '@/components/ThemeToggler/DarkModeToggler';
import TanstackProviders from '@/query/TanstackProvider';
import ReduxProvider from '@/redux/ReduxProvider';
import type { Metadata, Viewport } from 'next';
import { Orienta } from 'next/font/google';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';

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
    // 다크모드 -> 서버사이드에서 쿠키 읽어오기
    const colorTheme = (await cookies()).get('mode');
    // 디폴트 : 라이트모드
    const isDarkMode: boolean = colorTheme?.value === 'dark';

    return (
        <html
            lang="en"
            className={`${isDarkMode ? 'dark' : ''} ${pretendard.variable} ${orienta.variable} w-full`}
        >
            <body
                className={`font-pretendard antialiased bg-custom-light w-full`}
            >
                <ReduxProvider>
                    <TanstackProviders>
                        <div className={`max-w-[1200px] mx-auto`}>
                            <ThemeToggler colorTheme={isDarkMode} />
                            <NavBar />
                            {children}
                        </div>
                    </TanstackProviders>
                </ReduxProvider>
            </body>
        </html>
    );
}
