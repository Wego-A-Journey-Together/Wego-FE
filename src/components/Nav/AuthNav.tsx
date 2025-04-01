import Image from 'next/image';
import Link from 'next/link';

interface AuthNavProps {
    kakaoId?: string;
}

export default function AuthNav({ kakaoId }: AuthNavProps) {
    return (
        <div
            className={
                'flex flex-col items-center gap-1 text-center text-base font-semibold text-[#666666] md:ml-5 md:flex-row md:gap-7.5'
            }
        >
            <Link href={'#'} className={'cursor-pointer'}>
                찜한 동행
            </Link>
            <Link href={'#'} className={'cursor-pointer'}>
                대화목록
            </Link>
            <Link href={'#'} className={'cursor-pointer'}>
                알림
            </Link>
            <Link
                href={`/profile/${kakaoId}`}
                className="border-sky-blue h-8 w-8 cursor-pointer rounded-full border"
            >
                <Image
                    src={'/icon/profile/defaultProfile.svg'}
                    alt={'user'}
                    width={32}
                    height={32}
                />
            </Link>
        </div>
    );
}
