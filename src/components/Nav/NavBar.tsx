import MultiLingualToggler from '@/components/MultiLingual/MultiLingualToggler';
import Logo from '@/components/Nav/Logo';
import { SearchBar } from '@/components/Nav/SearchBar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function NavBar() {
    return (
        <header className="flex h-18 w-full items-center justify-between">
            {/*모바일 햄버거 메뉴*/}
            <section className="md:hidden">
                <Menu className="h-5 w-5 sm:h-7.5 sm:w-7.5" />
            </section>

            {/*좌측 섹션*/}
            <section className="flex items-center gap-3">
                {/*로고*/}
                <Logo />
                {/*서치바*/}
                <SearchBar className="hidden bg-neutral-100 md:flex dark:bg-neutral-800" />
            </section>

            {/*우측섹션*/}
            <section className="items-center md:flex">
                <Button className={`hidden px-7 py-2.5 md:flex`}>
                    <Link href={`/auth/login`}>로그인 및 회원가입</Link>
                </Button>
                <div className={`w-[20px]`} />

                <MultiLingualToggler />
            </section>
        </header>
    );
}
