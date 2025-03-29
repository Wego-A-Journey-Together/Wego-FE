'use client';

import { cn } from '@/lib';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggler({
    colorTheme,
    className,
}: {
    colorTheme: boolean;
    className?: string;
}) {
    // 서버에서 받은 초기 값으로 설정
    const [isDark, setIsDark] = useState(colorTheme);

    // 현재 테마 상태 확인
    useEffect(() => {
        // 문서가 로드된 후에만 실행
        const isDarkMode = document.documentElement.classList.contains('dark');
        if (isDarkMode !== isDark) {
            setIsDark(isDarkMode);
        }
    }, []); // 의존성 배열을 비워서 마운트 시에만 실행

    const toggleTheme = () => {
        const newMode = !isDark;
        setIsDark(newMode);

        // html 태그의 클래스 토글
        if (newMode) {
            // 다크모드로 변경
            document.documentElement.classList.add('dark');
            document.cookie = 'mode=dark; path=/; max-age=31536000';
        } else {
            // 라이트모드로 변경 (dark 제거)
            document.documentElement.classList.remove('dark');
            document.cookie = 'mode=light; path=/; max-age=31536000';
        }
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // 쿠키가 없을 경우 시스템 설정 확인
        const hasCookie = document.cookie.includes('mode');
        if (!hasCookie) {
            const prefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches;
            setIsDark(prefersDark);
            document.documentElement.classList.toggle('dark', prefersDark);
            document.cookie = `mode=${prefersDark ? 'dark' : 'light'}; path=/; max-age=31536000`;
        } else {
            const isDarkMode =
                document.documentElement.classList.contains('dark');
            setIsDark(isDarkMode);
        }
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-2 transition-all',
                className,
            )}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun className="text-sky-blue/80 h-5 w-5" />
            ) : (
                <Moon className="text-sky-blue/80 h-5 w-5" />
            )}
        </button>
    );
}
