import { NextRequest, NextResponse } from 'next/server';





// 지원하는 언어 목록
const locales = ['ko', 'en'];
const defaultLocale = 'ko'; // 기본값은 한국어

export function middleware(request: NextRequest) {
    // 경로 가져오기
    const pathname = request.nextUrl.pathname;

    // 정적 파일, API 경로 등은 처리하지 않음
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        // 로그인 callback URL 감시 X
        pathname.startsWith('/auth/kakao/callback')
    ) {
        return NextResponse.next();
    }

    // 현재 경로에 언어 코드가 포함되어 있는지 확인
    const pathnameHasLocale = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    // 경로에 이미 언어 코드가 포함되어 있으면 해당 언어를 쿠키에 저장하고 통과
    if (pathnameHasLocale) {
        const currentLocale = pathname.split('/')[1];
        const response = NextResponse.next();
        response.cookies.set('NEXT_LOCALE', currentLocale, {
            maxAge: 60 * 60 * 24 * 365,
        });
        return response;
    }

    // 쿠키에서 언어 설정 확인
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

    // 쿠키에 저장된 언어가 있고 지원하는 언어인 경우
    if (cookieLocale && locales.includes(cookieLocale)) {
        return NextResponse.redirect(
            new URL(`/${cookieLocale}${pathname}`, request.url),
        );
    }

    // 쿠키에 언어 설정이 없는 경우(첫 방문) 기본 한국어로 설정
    const response = NextResponse.redirect(
        new URL(`/${defaultLocale}${pathname}`, request.url),
    );

    response.cookies.set('NEXT_LOCALE', defaultLocale, {
        maxAge: 60 * 60 * 24 * 365,
    });

    return response;
}

// 미들웨어가 적용될 경로 지정
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
