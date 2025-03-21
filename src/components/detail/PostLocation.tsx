import Image from 'next/image';

interface PostLocationProps {
    location: string;
}

export default function PostLocation({ location }: PostLocationProps) {
    return (
        <>
            <div className="flex flex-col items-start gap-5">
                <h2 className="self-stretch text-xl font-bold tracking-tight text-black">
                    동행지 위치
                </h2>

                <div className="relative flex h-[450px] w-full items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    <span className="text-gray-500">지도 영역</span>
                </div>

                <div className="flex w-full items-center gap-3">
                    <Image
                        src="/icon/detail/pinIcon.svg"
                        alt="Location Pin"
                        width={13}
                        height={13}
                        className="text-gray-700"
                    />
                    <p className="text-base leading-5 font-medium text-[#333333]">
                        {location}
                    </p>
                </div>
            </div>
        </>
    );
}
