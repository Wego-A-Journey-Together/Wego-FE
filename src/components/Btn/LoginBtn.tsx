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
    /** #T101 타입 안정성: params.lang 타입 명시적 정의 필요 */
    const params = useParams(); // 지원하지 않는 언어인 경우 기본값으로 한국어 사용
    const [selectedLang, setSelectedLang] = useState('ko');

    /** #P102 성능: 불필요한 리렌더링 방지를 위해 useMemo 사용 검토 필요 */
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

    /** #A103 접근성: 키보드 네비게이션 및 포커스 관리 필요 */
    /** #U104 사용자 경험: 팝오버 닫기 버튼 및 외부 클릭 처리 필요 */
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
