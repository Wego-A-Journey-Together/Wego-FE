'use client';

import { cn } from '@/lib';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggler({
    colorTheme,
    className,
}: {
    colorTheme: boolean;
    className: string;
}) {
    // 서버에서 받은 초기 값으로 설정
    const [isDark, setIsDark] = useState(colorTheme);

    // 현재 테마 상태 확인
    useEffect(() => {
        // html 태그의 클래스를 확인해서 현재 테마 상태 가져오기
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

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
    // todo: 디자인 결정시 변경 해야함

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
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
