'use client';

import { useAppSelector } from '@/redux/hooks';
import Image from 'next/image';

const NEXT_PUBLIC_NEST_BFF_URL =
    process.env.NEXT_PUBLIC_NEST_BFF_URL || 'https://gateway.wego-travel.click';

export default function KAKAOLogin() {
    const translations = {
        ko: {
            kakaoImage: '/kakao/wideKorean.png',
        },
        en: {
            kakaoImage: '/kakao/wideEnglish.png',
        },
    };

    const t = useAppSelector((state) => state.locale.current);

    //-----------------------------------------------------------
    // KAKAO 로그인 관련
    //-------------------------------------------------------------

    const handleClick = () => {
        // 유저를 서버로 이동
        window.location.href = `${NEXT_PUBLIC_NEST_BFF_URL}/api/user/kakao/authorize`;
    };
    //lang 이 "ko"나 "en"이 아닐 경우에도 fallback "ko"를 기준으로 번역합니다

    return (
        <Image
            src={translations[t].kakaoImage}
            alt={'카카오 로그인'}
            width={300}
            height={45}
            className={`h-9 w-60 cursor-pointer object-contain`}
            onClick={handleClick}
        />
    );
}
