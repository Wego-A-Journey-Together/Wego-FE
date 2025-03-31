import Image from 'next/image';

export const ThumbnailBtn = () => {
    return (
        <div className="relative flex h-[100px] w-48 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#0ac7e44c] bg-white px-[30px] py-2">
            <div className="relative h-[26px] w-8">
                <Image
                    src={'/icon/thumbnailbtn.svg'}
                    alt={'img'}
                    width={32}
                    height={26}
                />
            </div>

            <div className="text-centertext-xs text-sky-blue relative w-fit leading-[15.6px] font-medium tracking-[0]">
                1200x400
                <br />
                (4:1 비율)
            </div>
        </div>
    );
};
