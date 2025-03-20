'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState } from 'react';

const SearchBar = ({
    placeholder = '동행 키워드를 검색해 보세요',
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="relative">
            {/* 데스크탑용 검색바 (md 이상) */}
            <div className="relative hidden h-12 w-[300px] items-center md:flex">
                <Input
                    type="text"
                    placeholder={placeholder}
                    className={cn(
                        'm-0 h-full border-0 bg-neutral-100 pr-10 shadow-none placeholder:text-neutral-500 dark:bg-neutral-800 dark:placeholder:text-neutral-200',
                        className,
                    )}
                    {...props}
                />
                <Button
                    variant="ghost"
                    className="absolute right-0 aspect-square h-full cursor-pointer p-0 hover:bg-transparent focus:bg-transparent"
                    type="submit"
                    aria-label="검색"
                >
                    <Image
                        src="/icon/search.png"
                        alt="Search"
                        width={15}
                        height={15}
                        className="pointer-events-none"
                    />
                </Button>
            </div>

            {/* 모바일용 검색 아이콘 및 확장 가능한 검색바 (md 미만) */}
            <div className="block md:hidden">
                <Button
                    variant="ghost"
                    className="aspect-square h-12 cursor-pointer p-0 hover:bg-transparent focus:bg-transparent"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    aria-label="검색 토글"
                >
                    <Image
                        src="/icon/search.png"
                        alt="Search"
                        width={15}
                        height={15}
                        className="pointer-events-none"
                    />
                </Button>

                {/* 모바일에서 검색 아이콘 클릭 시 나타나는 검색창 */}
                {isSearchOpen && (
                    <div className="absolute top-full right-0 z-10 mt-2 w-[calc(100vw-2rem)] max-w-[300px]">
                        <div className="relative flex h-12 items-center rounded bg-white shadow-lg dark:bg-neutral-800">
                            <Input
                                type="text"
                                placeholder={placeholder}
                                className="m-0 h-full border-0 pr-10 shadow-none placeholder:text-neutral-500 dark:placeholder:text-neutral-200"
                                autoFocus
                                {...props}
                            />
                            <Button
                                variant="ghost"
                                className="absolute right-0 aspect-square h-full cursor-pointer p-0 hover:bg-transparent focus:bg-transparent"
                                type="submit"
                                aria-label="검색"
                            >
                                <Image
                                    src="/icon/search.png"
                                    alt="Search"
                                    width={15}
                                    height={15}
                                    className="pointer-events-none"
                                />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { SearchBar };
