'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLocale } from '@/redux/slices/localeSlice';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function MultiLingualToggler() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    // URL에서 언어 감지 (ko, en 없으면 기본값 ko)
    const selectedLang = useAppSelector((state) => state.locale.current);

    const handleLanguageChange = (newLang: string) => {
        // 언어 변경 시 쿠키 업데이트
        document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}`;

        dispatch(setLocale(newLang === 'en' ? 'en' : 'ko'));

        const newPath = pathname.replace(/^\/(ko|en)/, `/${newLang}`);
        router.replace(newPath);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-0">
                {/*  Globe 아이콘 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/icon/globe.svg"
                    width="18"
                    height="18"
                    alt="globe"
                    style={{ width: '18px', height: '18px' }}
                />

                {/* 현재 선택된 언어 */}
                <span className="hidden text-sm font-medium text-gray-600 md:ml-1.5 md:block">
                    {selectedLang === 'ko' ? '한국어' : 'English'}
                </span>
                <ChevronDown className={`h-3 w-6`} />
            </DropdownMenuTrigger>

            {/* 드롭다운 메뉴 */}
            <DropdownMenuContent
                align="start"
                className="bg-white px-0 shadow-none dark:bg-neutral-800"
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
