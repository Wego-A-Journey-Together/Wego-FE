// ThumbnailBtn.tsx
import Image from 'next/image';
import { forwardRef } from 'react';





type ThumbnailBtnProps = React.HTMLAttributes<HTMLDivElement>;

export const ThumbnailBtn = forwardRef<HTMLDivElement, ThumbnailBtnProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                {...props}
                className={`relative flex h-[100px] w-48 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#0ac7e44c] bg-white px-[30px] py-2 ${className}`}
            >
                <div className="relative h-[26px] w-8">
                    <Image
                        src={'/icon/thumbnailbtn.svg'}
                        alt={'img'}
                        width={32}
                        height={26}
                    />
                </div>
                <div className="text-sky-blue text-center text-xs leading-[15.6px] font-medium">
                    1200x400
                    <br />
                    (4:1 비율)
                </div>
            </div>
        );
    },
);

ThumbnailBtn.displayName = 'ThumbnailBtn';
