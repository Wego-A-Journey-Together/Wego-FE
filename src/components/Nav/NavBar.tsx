export default function NavBar() {
    return (
        <header className="h-18 flex items-center justify-between w-full">
            <section className="flex items-center gap-1">
                <div>
                    <p className={`text-sky-blue text-[40px] font-bold`}>
                        Wego
                    </p>
                </div>
                <div>검색바</div>
            </section>
            <section className="flex items-center gap-1">
                <div>동행찾기</div>
                <div>로그인 및 회원가입</div>
                <div>언어선택</div>
            </section>
        </header>
    );
}
