import { SearchBar } from '@/components/Nav/SearchBar';





export default function NavBar() {
    return (
        <header className="h-18 flex items-center justify-between w-full">
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
                <SearchBar className="bg-[#EBEDF1] " />
            </section>

            {/*우측섹션*/}
            <section className="flex items-center gap-1">
                <div>동행찾기</div>
                <div>로그인 및 회원가입</div>
                <div>언어선택</div>
            </section>
        </header>
    );
}
