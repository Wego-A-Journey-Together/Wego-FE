import { NextRequest, NextResponse } from 'next/server';





// 지원하는 언어 목록
const locales = ['ko', 'en'];
const defaultLocale = 'ko'; // 기본값은 한국어

// 로그인 필요한 경로
const protectedPaths = ['/write', '/profile'];

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

    // 언어코드 뺀 실제 경로
    let pathWithoutLocale = pathname;
    if (pathnameHasLocale) {
        const segments = pathname.split('/');
        pathWithoutLocale = '/' + segments.slice(2).join('/');
    }

    // 로그인 검증이 필요한 경로인지 확인
    const isProtectedPath = protectedPaths.some(
        (path) =>
            pathWithoutLocale === path ||
            pathWithoutLocale.startsWith(`${path}/`),
    );

    //  DEV 모드에서 비활성화 해서 UI 접근 가능하게 설정 ( 스토리북 쓰기엔 시간이 없어서.. )
    if (isProtectedPath && process.env.NODE_ENV !== 'development') {
        // 쿠키나 세션에서 로그인 상태 확인
        const isLoggedIn =
            request.cookies.has('accessToken') &&
            request.cookies.has('refreshToken');

        if (!isLoggedIn) {
            // 현재 사용 중인 언어 확인
            let currentLocale = defaultLocale;
            if (pathnameHasLocale) {
                currentLocale = pathname.split('/')[1];
            } else {
                currentLocale =
                    request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
            }

            // 로그인 필요 알림을 위한 상태 값 추가
            const url = new URL(request.url);
            url.pathname = `/${currentLocale}`;
            url.searchParams.set('loginRequired', 'true');

            return NextResponse.redirect(url);
        }
    }

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
