import MultiLingualToggler from '@/components/MultiLingual/MultiLingualToggler';
import Logo from '@/components/Nav/Logo';
import { SearchBar } from '@/components/Nav/SearchBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NavBar() {
    return (
        <header className="h-18 flex items-center justify-between w-full">
            {/*좌측 섹션*/}
            <section className="flex items-center gap-3">
                {/*로고*/}
                <Logo />
                {/*서치바*/}
                <SearchBar className="bg-neutral-100 dark:bg-neutral-800" />
            </section>

            {/*우측섹션*/}
            <section className="flex items-center">
                <div className={`font-semibold text-gray-600`}>동행찾기</div>
                <div className={`w-[30px]`} />
                <Button className={`px-7 py-2.5`}>
                    <Link href={`/auth/login`}>로그인 및 회원가입</Link>
                </Button>
                <div className={`w-[20px]`} />

                <MultiLingualToggler />
            </section>
        </header>
    );
}
