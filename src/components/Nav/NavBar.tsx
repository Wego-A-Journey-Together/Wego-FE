'use client';

import LoginBtn from '@/components/Btn/LoginBtn';
import MultiLingualToggler from '@/components/MultiLingual/MultiLingualToggler';
import Hamburger from '@/components/Nav/Hamburger';
import Logo from '@/components/Nav/Logo';
import { SearchBar } from '@/components/Nav/SearchBar';
import useMediaQuery from '@/hooks/useMediaQuery';
import { cn } from '@/lib';

interface NavProps {
    className?: string;
}

export default function NavBar({ className }: NavProps) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <header
            className={cn(
                'flex h-18 w-full items-center justify-between',
                className,
            )}
        >
            {/*햄버거 메뉴*/}
            {!isDesktop && <Hamburger />}

            {/*좌측 섹션*/}
            <section className="absolute left-1/2 -translate-x-1/2 transform items-center gap-3 md:static md:flex md:translate-x-0">
                {/*로고*/}
                <Logo />
                {/*서치바*/}
                {isDesktop && (
                    <SearchBar className="bg-neutral-100 md:flex dark:bg-neutral-800" />
                )}
            </section>

            {/*우측섹션*/}
            <section className="flex items-center">
                {!isDesktop && (
                    <SearchBar className="bg-neutral-100 md:flex dark:bg-neutral-800" />
                )}
                {isDesktop && (
                    <>
                        <LoginBtn />

                        <div className={`w-[20px]`} />
                    </>
                )}

                <MultiLingualToggler />
            </section>
        </header>
    );
}
