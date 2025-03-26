import LoadingSpinner from '@/components/LoadingSpinner';
import React, { Suspense } from 'react';

import '../../../globals.css';

/**
 * 콜백 페이지 래퍼입니다.
 * @param children
 * @constructor
 */
export default function KakaoCallbackLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body>
                {/*useSearchParams() 를 사용하려면 부모에서 Suspense 로 감아야 빌드 에러가 안난다.*/}
                <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
            </body>
        </html>
    );
}
