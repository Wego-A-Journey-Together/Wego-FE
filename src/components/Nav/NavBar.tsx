'use client';

import MultiLingualToggler from '@/components/MultiLingual/MultiLingualToggler';
import Logo from '@/components/Nav/Logo';
import { SearchBar } from '@/components/Nav/SearchBar';
import { Button } from '@/components/ui/button';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
    const isMobile = useMediaQuery('(max-width: 639px)');
    const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 767px)');
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="flex h-18 w-full items-center justify-between">
            {/*햄버거 메뉴*/}
            {!isDesktop && (
                <section>
                    <Menu className="h-5 w-5 sm:h-7.5 sm:w-7.5" />
                </section>
            )}

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
                        <Button className={`px-7 py-2.5 md:flex`}>
                            <Link href={`/auth/login`}>로그인 및 회원가입</Link>
                        </Button>

                        <div className={`w-[20px]`} />
                    </>
                )}

                <MultiLingualToggler />
            </section>
        </header>
    );
}
