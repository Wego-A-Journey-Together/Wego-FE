import { PostContentProps } from '@/types/PostContent';
import Image from 'next/image';

export default function UserProfile({ post }: PostContentProps) {
    return (
        <>
            {/* 유저 프로필 영역 */}
            <div className="mt-7.5 flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-2">
                {/* 아이콘 */}
                <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                        <Image
                            src={post.profileImage}
                            alt="유저 프로필 이미지"
                            width={50}
                            height={50}
                            className="z-0 h-full w-full object-cover"
                        />
                    </div>
                    {/* 유저 정보 */}
                    <div className="flex w-[187px] flex-col items-start gap-1.5">
                        <h1 className="w-full text-[15px] font-semibold text-black">
                            {post.userName}
                        </h1>
                        <div className="flex items-center gap-2 rounded-[24.53px] bg-[#e5e8ea] px-3 py-1.5">
                            <p className="text-xs text-[#666666]">
                                {post.statusMessage}
                            </p>
                            <div className="h-1.5 w-px bg-gray-300" />
                            <p className="text-xs text-[#666666]">{post.age}</p>
                            <div className="h-1.5 w-px bg-gray-300" />
                            <p className="text-xs text-[#666666]">
                                {post.gender}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 리뷰, 평점 */}
                <div className="flex flex-col items-end gap-[3px]">
                    <div className="flex">
                        <Image
                            src="/icon/detail/reviewStar.svg"
                            alt="별 이미지"
                            width={16}
                            height={16}
                        />
                        <p className="text-base font-semibold">
                            {`${post.rating.toFixed(1)}(${post.reviewCount})`}
                        </p>
                    </div>

                    <p className="text-xs">동행 리뷰</p>
                </div>
            </div>
        </>
    );
}
