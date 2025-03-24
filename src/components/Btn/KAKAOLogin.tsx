'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function KAKAOLogin() {
    const params = useParams(); // 지원하지 않는 언어인 경우 기본값으로 한국어 사용
    const [selectedLang, setSelectedLang] = useState('ko');

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

    //lang 이 "ko"나 "en"이 아닐 경우에도 fallback "ko"를 기준으로 번역합니다
    const t = translations[selectedLang as keyof typeof translations];
    return (
        <Link href={`/auth/login`}>
            <Image
                src={t.kakaoImage}
                alt={'카카오 로그인'}
                width={300}
                height={45}
                className={`h-9 w-60 object-contain`}
            />
        </Link>
    );
}
