import { SearchBar } from '@/components/Nav/SearchBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NavBar() {
    return (
        <header className="h-18 flex items-center justify-between w-full px-5">
            {/*좌측 섹션*/}
            <section className="flex items-center gap-3">
                {/*로고*/}
                <div className="flex items-center">
                    <p
                        className={`text-sky-blue text-4xl font-semibold leading-none font-orienta`}
                    >
                        Wego
                    </p>
                </div>
                {/*서치바*/}
                <SearchBar className="bg-[#EBEDF1] dark:bg-neutral-950" />
            </section>

            {/*우측섹션*/}
            <section className="flex items-center">
                <div className={`font-semibold text-gray-600`}>동행찾기</div>
                <div className={`w-[30px]`} />
                <Button className={`px-7 py-2.5`}>
                    <Link href={`/auth/login`}>로그인 및 회원가입</Link>
                </Button>
                <div className={`w-[20px]`} />

                <div>언어선택</div>
            </section>
        </header>
    );
}
