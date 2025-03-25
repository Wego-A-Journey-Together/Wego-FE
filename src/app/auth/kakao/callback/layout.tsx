import React from 'react';

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
            <body>{children}</body>
        </html>
    );
}
