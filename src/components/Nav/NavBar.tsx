'use client';

import LoginBtn from '@/components/Btn/LoginBtn';
import MultiLingualToggler from '@/components/MultiLingual/MultiLingualToggler';
import AuthNav from '@/components/Nav/AuthNav';
import Hamburger from '@/components/Nav/Hamburger';
import Logo from '@/components/Nav/Logo';
import { SearchBar } from '@/components/Nav/SearchBar';
import ThemeToggler from '@/components/ThemeToggler/DarkModeToggler';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib';

interface NavProps {
    className?: string;
    isDarkMode: boolean;
}

export default function NavBar({ className, isDarkMode }: NavProps) {
    const { isAuthenticated, kakaoId } = useSession();

    return (
        <header
            className={cn(
                'm-auto flex h-18 w-full items-center justify-between',
                className,
            )}
        >
            {/* 데스크탑 레이아웃 */}
            <div className="m-auto hidden w-full max-w-[1240px] px-[20px] md:flex md:items-center md:justify-between">
                <section className="flex items-center gap-3">
                    <Logo />
                    <SearchBar className="bg-neutral-100 dark:bg-neutral-800" />
                </section>

                <section className="flex items-center">
                    <ThemeToggler colorTheme={isDarkMode} />

                    {isAuthenticated ? (
                        <AuthNav kakaoId={kakaoId} />
                    ) : (
                        <LoginBtn />
                    )}

                    <div className="w-[20px]" />
                    <MultiLingualToggler />
                </section>
            </div>

            {/* 모바일 레이아웃 */}
            <div className="flex w-full items-center justify-between md:hidden">
                <Hamburger
                    isDarkMode={isDarkMode}
                    isAuthenticated={isAuthenticated}
                    kakaoId={kakaoId}
                />

                <section className="absolute left-1/2 -translate-x-1/2 transform">
                    <Logo />
                </section>

                <section className="flex items-center">
                    <SearchBar className="bg-neutral-100 dark:bg-neutral-800" />
                    <MultiLingualToggler />
                </section>
            </div>
        </header>
    );
}
