import KakaoMapViewer from '@/components/detail/KakaoMapViewer';
import Image from 'next/image';

export default function PostLocation() {
    return (
        <>
            <div className="flex flex-col items-start gap-5">
                <h2 className="self-stretch text-xl font-bold tracking-tight text-black">
                    동행지 위치
                </h2>

                <KakaoMapViewer lat={35.1004} lng={129.0359} />

                <div className="flex w-full items-center gap-3">
                    <Image
                        src="/icon/detail/pinIcon.svg"
                        alt="Location Pin"
                        width={13}
                        height={13}
                        className="text-gray-700"
                    />
                    <p className="text-base leading-5 font-medium text-[#333333]">
                        {'부산 광역시 중구'}
                    </p>
                </div>
            </div>
        </>
    );
}
