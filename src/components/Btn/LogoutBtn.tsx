'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function LogoutBtn() {
    const [isClicked, setIsClicked] = useState(false);
    const handleLogoutClick = async () => {
        setIsClicked(true);
        try {
            const NEXT_PUBLIC_NEST_BFF_URL =
                process.env.NEXT_PUBLIC_NEST_BFF_URL;
            await fetch(`${NEXT_PUBLIC_NEST_BFF_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            // 로그아웃 후 페이지 새로고침 (api/user/me -> 리덕스 초기화)
            window.location.reload();
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
            setIsClicked(false); // 오류 발생 시 로딩 상태 해제
        }
    };
    return (
        <>
            <Button
                variant={'reset'}
                onClick={handleLogoutClick}
                disabled={isClicked}
            >
                {isClicked ? (
                    <Loader2 className="bg-sky-blue mr-2 h-4 w-4 animate-spin" />
                ) : (
                    '로그 아웃'
                )}
            </Button>
        </>
    );
}
