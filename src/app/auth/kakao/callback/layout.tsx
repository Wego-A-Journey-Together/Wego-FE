import React from 'react';

import '../../../globals.css';

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
