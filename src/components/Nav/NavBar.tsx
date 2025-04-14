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
    /** #T101 타입 안정성: useSession 반환값의 타입 명시적 정의 필요 */
    const { isAuthenticated, kakaoId, nickname } = useSession();

    /** #A102 접근성: 스킵 네비게이션 링크 추가 필요 */
    /** #P103 성능: 컴포넌트 분할 및 메모이제이션 검토 필요 */
    return (
        <header
            className={cn(
                'justify-between] m-auto flex h-18 w-full items-center',
                className,
            )}
        >
            {/* 데스크탑 레이아웃 */}
            {/** #U104 사용자 경험: 반응형 레이아웃 전환 시 부드러운 애니메이션 추가 필요 */}
            <div className="m-auto hidden w-full max-w-[1240px] px-[20px] md:flex md:items-center md:justify-between">
                <section className="flex items-center gap-3">
                    <Logo />
                    <SearchBar className="bg-neutral-100 dark:bg-neutral-800" />
                </section>

                <section className="flex items-center">
                    <ThemeToggler colorTheme={isDarkMode} />

                    {isAuthenticated ? (
                        <AuthNav kakaoId={kakaoId} nickname={nickname} />
                    ) : (
                        <LoginBtn />
                    )}

                    <div className="w-[20px]" />
                    <MultiLingualToggler />
                </section>
            </div>

            {/* 모바일 레이아웃 */}
            {/** #A105 접근성: 모바일 메뉴의 키보드 접근성 개선 필요 */}
            <div className="flex w-full items-center justify-between px-[20px] md:hidden">
                <Hamburger
                    isDarkMode={isDarkMode}
                    isAuthenticated={isAuthenticated}
                    kakaoId={kakaoId}
                    nickname={nickname}
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
