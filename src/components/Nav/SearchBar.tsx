import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

const SearchBar = ({
    placeholder = '동행 키워드를 검색해 보세요',
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <div className="relative flex items-center w-[300px] h-12">
            <Input
                type="text"
                placeholder={placeholder}
                className={cn(
                    'pr-10 placeholder:text-neutral-500 h-full m-0 border-0 shadow-none',
                    className,
                )}
                {...props}
            />
            <Button
                variant="ghost"
                className="absolute right-0 h-full aspect-square p-0 hover:bg-transparent focus:bg-transparent"
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
    );
};

export { SearchBar };
