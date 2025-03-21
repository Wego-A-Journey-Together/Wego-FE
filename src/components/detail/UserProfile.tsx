import { PostContentProps } from '@/types/PostContent';
import Image from 'next/image';

export default function UserProfile({ post }: PostContentProps) {
    return (
        <div>
            {/* 유저 프로필 영역 */}
            <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-2">
                {/* 아이콘 */}
                <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                        <Image
                            src={'/image/dogProfile.png'} // 임시 이미지 경로, 추후 바인딩
                            alt="유저 프로필 이미지"
                            width={50}
                            height={50}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* 유저 정보 */}
                    <div className="flex w-[187px] flex-col items-start gap-1.5">
                        <div className="w-full text-[15px] font-semibold text-black">
                            {post.userName}
                        </div>
                        <div className="flex items-center gap-2 rounded-[24.53px] bg-[#e5e8ea] px-3 py-1.5">
                            <span className="text-xs text-[#666666]">
                                {post.title}
                            </span>
                            <div className="h-1.5 w-px bg-gray-300" />
                            <span className="text-xs text-[#666666]">
                                {post.age}
                            </span>
                            <div className="h-1.5 w-px bg-gray-300" />
                            <span className="text-xs text-[#666666]">
                                {post.gender}
                            </span>
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
                        <h2 className="text-base font-semibold">
                            {'4.6'}
                            {'(12)'}
                        </h2>
                    </div>

                    <h2 className="text-xs">동행 리뷰</h2>
                </div>
            </div>
        </div>
    );
}
