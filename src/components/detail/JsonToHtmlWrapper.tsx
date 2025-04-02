'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicJsonToHtml = dynamic(
    () => import('@/components/detail/JsonToHtml'),
    {
        ssr: false,
        loading: () => (
            //JavaScript 파일이 다운로드되는 동안 표시 될 UI 입니다.
            <div className="bg-sky-blue/50 h-40 animate-pulse rounded"></div>
        ),
    },
);

/**
 * SSR로 content를 넘기도록 리팩토링한 이후에 제이슨을 html로 랜더링하는 함수가 서버에서 실행되는 문제 발생
 * ('use client') 사용해도 방어가 되지 않아 dinamic 과 suspense 를 적용 하였습니다.
 * @param content
 * @constructor
 */
export default function JsonToHtmlWrapper({ content }: { content: string }) {
    return (
        <Suspense
            fallback={
                //컴포넌트 마운트 이전까지 보일 UI 입니다.
                <div className="bg-sky-blue/50 h-40 animate-pulse rounded"></div>
            }
        >
            <DynamicJsonToHtml content={content} />
        </Suspense>
    );
}
