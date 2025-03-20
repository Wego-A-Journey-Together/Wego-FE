'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MultiLingualToggler() {
    const router = useRouter();
    const pathname = usePathname();

    // URL에서 언어 감지 (ko, en 없으면 기본값 ko)
    const currentLang = pathname.startsWith('/en') ? 'en' : 'ko';
    const [selectedLang, setSelectedLang] = useState(currentLang);

    useEffect(() => {
        setSelectedLang(currentLang); // URL 변경될 때 상태 업데이트
    }, [currentLang]);

    const handleLanguageChange = (newLang: string) => {
        // 언어 변경 시 쿠키 업데이트
        document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}`;

        // 현재 경로에서 언어 부분을 교체하여 새로운 경로 생성
        const newPath = pathname.replace(/^\/(ko|en)/, `/${newLang}`);
        router.replace(newPath);
        setSelectedLang(newLang); // UI 즉시 업데이트
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-0">
                {/*  Globe 아이콘 */}
                <Image
                    src="/icon/globe.png"
                    width={18}
                    height={18}
                    alt="globe"
                />

                {/* 현재 선택된 언어 */}
                <span className="hidden min-w-[60px] text-sm font-medium text-gray-600 md:block">
                    {selectedLang === 'ko' ? '한국어' : 'English'}
                </span>
                <ChevronDown className={`h-3 w-6`} />
            </DropdownMenuTrigger>

            {/* 드롭다운 메뉴 */}
            <DropdownMenuContent
                align="start"
                className="bg-white shadow-none dark:bg-neutral-800"
            >
                <DropdownMenuItem onClick={() => handleLanguageChange('ko')}>
                    🇰🇷 한국어
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                    🇺🇸 English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
