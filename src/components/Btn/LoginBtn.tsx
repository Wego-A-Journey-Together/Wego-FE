'use client';

import KAKAOLogin from '@/components/Btn/KAKAOLogin';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginBtn() {
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
            text: '로그인 및 회원가입',
        },
        en: {
            text: 'login or sign up',
        },
    };

    const t = translations[selectedLang as keyof typeof translations];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className={cn(`h-[37px] w-41 px-7 py-2.5`)}>
                    {t.text}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <KAKAOLogin />
            </PopoverContent>
        </Popover>
    );
}
