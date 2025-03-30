'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const NEST_BFF_URL =
    process.env.NEST_BFF_URL || 'https://gateway.wego-travel.click';

export default function KAKAOLogin() {
    const params = useParams(); // 지원하지 않는 언어인 경우 기본값으로 한국어 사용
    const [selectedLang, setSelectedLang] = useState('ko');

    //-----------------------------------------------------------
    // 다국어 관련
    //-------------------------------------------------------------
    useEffect(() => {
        // params 에서 lang 값 가져오기
        const lang = params.lang as string;
        // 지원하지 않는 언어인 경우 기본값으로 한국어 사용
        setSelectedLang(lang === 'ko' || lang === 'en' ? lang : 'ko');
    }, [params]);

    const translations = {
        ko: {
            kakaoImage: '/kakao/wideKorean.png',
        },
        en: {
            kakaoImage: '/kakao/wideEnglish.png',
        },
    };

    //-----------------------------------------------------------
    // KAKAO 로그인 관련
    //-------------------------------------------------------------

    const handleClick = () => {
        // 유저를 서버로 이동
        window.location.href = `${NEST_BFF_URL}/api/user/kakao/authorize`;
    };

    //lang 이 "ko"나 "en"이 아닐 경우에도 fallback "ko"를 기준으로 번역합니다
    const t = translations[selectedLang as keyof typeof translations];

    return (
        <Image
            src={t.kakaoImage}
            alt={'카카오 로그인'}
            width={300}
            height={45}
            className={`h-9 w-60 object-contain`}
            onClick={handleClick}
        />
    );
}
