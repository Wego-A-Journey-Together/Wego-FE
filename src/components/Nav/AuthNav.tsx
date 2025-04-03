import LogoutBtn from '@/components/Btn/LogoutBtn';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import Link from 'next/link';

interface AuthNavProps {
    kakaoId?: string;
    nickname?: string;
}

export default function AuthNav({ kakaoId, nickname }: AuthNavProps) {
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
            <Popover>
                <PopoverTrigger
                    asChild
                    className="border-sky-blue h-8 w-8 cursor-pointer rounded-full border"
                >
                    <Button variant="ghost" aria-label="프로필 메뉴">
                        <Image
                            src={'/icon/profile/defaultProfile.svg'}
                            alt={'프로필 이미지'}
                            width={32}
                            height={32}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                    <div className="flex flex-col space-y-2">
                        <p className="font-semibold">{`${nickname}님`}</p>
                        <div className="h-px bg-gray-200"></div>
                        <Link
                            href={`/profile/${kakaoId}`}
                            className="hover:text-sky-blue py-2"
                        >
                            마이 페이지
                        </Link>
                        <div className="h-px bg-gray-200"></div>
                        <div className="pt-1">
                            <LogoutBtn />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
