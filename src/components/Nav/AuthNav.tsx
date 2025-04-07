'use client';

import LogoutBtn from '@/components/Btn/LogoutBtn';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useLocale } from '@/hooks/useLocale';
import { useAppSelector } from '@/redux/hooks';
import Image from 'next/image';
import Link from 'next/link';

interface AuthNavProps {
    kakaoId?: string;
    nickname?: string;
}

export default function AuthNav({ kakaoId, nickname }: AuthNavProps) {
    const { t } = useLocale();
    const locale = useAppSelector((state) => state.locale.current);
    return (
        <div
            className={
                'flex flex-col items-center gap-1 text-center text-base font-semibold text-[#666666] md:ml-5 md:flex-row md:gap-7.5'
            }
        >
            <Link href={'#'} className={'cursor-pointer'}>
                {t.gnb.book}
            </Link>
            <Link href={`/chat/${kakaoId}`} className={'cursor-pointer'}>
                {t.gnb.chat}
            </Link>
            <Link href={'#'} className={'cursor-pointer'}>
                {t.gnb.alert}
            </Link>
            <Popover>
                <PopoverTrigger
                    asChild
                    className="border-sky-blue h-8 w-8 cursor-pointer rounded-full border"
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 overflow-hidden rounded-full p-0"
                        aria-label={t.gnb.pAria}
                    >
                        <Image
                            src={'/icon/profile/defaultProfile.svg'}
                            alt={'프로필 이미지'}
                            width={32}
                            height={32}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                    <div className="flex flex-col items-center space-y-2">
                        <p className="font-semibold">
                            {locale !== 'en'
                                ? `${nickname} ${t.gnb.dear}`
                                : `${t.gnb.dear} ${nickname}`}
                        </p>
                        <div className="h-px w-full bg-gray-200"></div>
                        <Link
                            href={`/profile/${kakaoId}`}
                            className="hover:text-sky-blue py-1"
                        >
                            {t.gnb.mypage}
                        </Link>
                        <div className="pt-1">
                            <LogoutBtn />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
