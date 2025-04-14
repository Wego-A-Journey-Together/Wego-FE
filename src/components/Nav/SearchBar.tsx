'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const SearchBar = ({
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
    const router = useRouter();
    const pathname = usePathname();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [desktopValue, setDesktopValue] = useState('');
    const [mobileValue, setMobileValue] = useState('');

    const desktopInputRef = useRef<HTMLInputElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { t } = useLocale();

    // 영역 밖 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsSearchOpen(false);
                setMobileValue('');

                // 뒤에 요소 클릭 막기
                event.preventDefault();
                event.stopPropagation();
            }
        };

        if (isSearchOpen) {
            document.addEventListener('mousedown', handleClickOutside, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
        };
    }, [isSearchOpen]);

    // 의존성 이므로 재랜더링 방지 위한 useCallback
    const handleSearch = useCallback(() => {
        // 모바일에서는 mobileValue, 데스크탑에서는 desktopValue 사용
        const value = isSearchOpen ? mobileValue : desktopValue;

        if (value && value.trim() !== '') {
            const segments = pathname.split('/').filter(Boolean);
            const locale = segments[0] ?? 'ko';
            const targetPath = `/${locale}/search?keyword=${encodeURIComponent(value)}`;
            console.log('검색 실행:', value);
            router.push(targetPath);

            // 검색 후 입력창 초기화
            if (isSearchOpen) {
                setMobileValue('');
            } else {
                setDesktopValue('');
            }
        }

        // 모바일 검색창 닫기
        if (isSearchOpen) {
            setIsSearchOpen(false);
        }
    }, [isSearchOpen, mobileValue, desktopValue, router]);

    // 키보드 입력 감지 (전역)
    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            // ESC 키를 누르면 모바일 검색창 닫기
            if (event.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
                setMobileValue('');
            }

            // 데스크톱에서 엔터 키 처리
            if (
                event.key === 'Enter' &&
                document.activeElement === desktopInputRef.current
            ) {
                handleSearch();
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);

        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [isSearchOpen, desktopValue, mobileValue, handleSearch]);

    const handleDesktopInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setDesktopValue(e.target.value);
    };

    const handleMobileInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setMobileValue(e.target.value);
    };

    const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
            e.preventDefault();
        }
    };

    return (
        <div className="relative">
            {/* 데스크탑용 검색바 (md 이상) */}
            <div className="relative hidden h-12 w-[300px] items-center md:flex">
                <Input
                    ref={desktopInputRef}
                    type="text"
                    placeholder={t.gnb.placeholder}
                    value={desktopValue}
                    onChange={handleDesktopInputChange}
                    className={cn(
                        'm-0 h-full border-0 bg-neutral-100 pr-10 shadow-none placeholder:text-neutral-500 focus:outline-none focus-visible:border-0 focus-visible:ring-0 dark:bg-neutral-800 dark:placeholder:text-neutral-200',
                        className,
                    )}
                    {...props}
                />
                <Button
                    variant="ghost"
                    className="absolute right-0 aspect-square h-full cursor-pointer p-0 hover:bg-transparent focus:bg-transparent"
                    type="button"
                    aria-label={t.gnb.sAria}
                    onClick={handleSearch}
                >
                    <Search size={15} className="pointer-events-none" />
                </Button>
            </div>

            {/* 모바일용 검색 아이콘 및 확장 가능한 검색바 (md 미만) */}
            <div className="block md:hidden">
                <Button
                    variant="ghost"
                    className="aspect-square h-12 cursor-pointer p-0 hover:bg-transparent focus:bg-transparent"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    aria-label={t.gnb.sTAria}
                >
                    <Search size={15} className="pointer-events-none" />
                </Button>

                {/* 모바일에서 검색 아이콘 클릭 시 나타나는 검색창 */}
                {isSearchOpen && (
                    <div
                        ref={searchRef}
                        className="absolute top-full right-0 z-10 mt-2 w-[calc(100vw-2rem)] max-w-[300px]"
                    >
                        <div className="relative flex h-12 items-center rounded bg-white shadow-lg dark:bg-neutral-800">
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder={t.gnb.placeholder}
                                value={mobileValue}
                                onChange={handleMobileInputChange}
                                onKeyDown={handleMobileKeyDown}
                                className="m-0 h-full border-0 pr-10 shadow-none placeholder:text-neutral-500 focus:outline-none focus-visible:border-0 focus-visible:ring-0 dark:placeholder:text-neutral-200"
                                autoFocus
                                {...props}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { SearchBar };
