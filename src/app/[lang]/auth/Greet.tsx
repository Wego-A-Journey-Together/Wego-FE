import Image from 'next/image';

export default function Greet() {
    return (
        <section
            className={`mx-auto flex flex-col gap-7 text-center whitespace-nowrap`}
        >
            <h2 className={`text-2xl font-bold md:text-3xl`}>
                WellCome to 같이달램!
            </h2>
            <p>
                바쁜 일상 속 잠깐의 휴식,
                <br />
                이제는 같이 달램과 함께 해보세요
            </p>

            <div className="mx-auto w-[290px] md:w-[407px] lg:w-[587px]">
                <Image
                    src="/auth/mascot.png"
                    alt="greet"
                    width={588}
                    height={461}
                    priority
                />
            </div>
        </section>
    );
}
