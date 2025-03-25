'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/**
 * 유저가 kakao 로그인 이후 잠시 머무는 콜백 페이지 입니다.
 * searchparams 에서 인가 코드를 분리하여 bff 로 전송합니다.
 * 회원가입 실패시 3초간 안내메시지 띄운 후 홈페이지 리디렉션
 * 성공시 홈페이지 리디렉션을 수행합니다.
 * @constructor
 */
export default function CallBackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
        null,
    );

    /**
     * 인증 실패시 작동하는 타이머
     */
    const startRedirectCountdown = useCallback(
        (seconds: number) => {
            setRedirectCountdown(seconds);

            const interval = setInterval(() => {
                setRedirectCountdown((prev) => {
                    if (prev === null || prev <= 1) {
                        clearInterval(interval);
                        router.push('/');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        },
        [router],
    );

    /**
     * 쿼리 파라미터에서 code 인가코드 분리하여 api 서버로 전송합니다.
     */
    useEffect(() => {
        /**
         * 로그인 함수 선언 (useEffect 에서 비동기 함수 실행시키기 위환 우회)
         */
        const handleLogin = async () => {
            try {
                //인가코드 획득
                const code = searchParams.get('code');

                // 코드가 없으면 바로 홈페이지로 리디렉션
                if (!code) {
                    router.push('/');

                    setError('소셜 로그인에 실패했습니다.');
                    startRedirectCountdown(3);
                    return;
                }

                // todo: 인가코드 체크용 콘솔로그 -> 배포전 제거하기
                console.log('인가코드:', code);

                // 인가 코드를 BFF(/api/auth/kakao)에 POST 요청
                const response = await fetch('/api/auth/kakao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    //todo: HttpOnly 쿠키 사용시 유지 회의에 따라 결정
                    credentials: 'include',
                    body: JSON.stringify({ code }),
                });

                // 실패 응답시 메시지 띄운 후 3초후 홈페이지 리디렉션
                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage =
                        errorData.message ||
                        '로그인 처리 중 오류가 발생했습니다.';
                    setError(errorMessage);
                    startRedirectCountdown(3);
                    return;
                }
                // 성공시 홈페이지로 바로 리디렉션
                router.push('/');
            } catch (e) {
                console.error('카카오 로그인 에러:', e);
                setError(
                    e instanceof Error
                        ? e.message
                        : '로그인 처리 중 오류가 발생했습니다.',
                );
                startRedirectCountdown(3);
            }
        };

        // 프로미스를 의도적으로 무시하기 위한 void, 로그인 핸들러 실행.
        void handleLogin();
    }, [router, searchParams, startRedirectCountdown]);

    // 에러 UI
    if (error) {
        return (
            <>
                <LoadingSpinner />
                <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
                    <div className="max-w-md rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                        <p className="font-bold">오류가 발생했습니다</p>
                        <p>{error}</p>
                        {redirectCountdown !== null && (
                            <p className="mt-2 text-sm">
                                {redirectCountdown}초 후 홈페이지로
                                이동합니다...
                            </p>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // 디폴트 로딩스피너
    return <LoadingSpinner />;
}
