import Image from 'next/image';
import Link from 'next/link';

interface UserProfileProps {
    post: {
        userName: string;
        statusMessage: string;
        userAge: number | string;
        userGender: string;
        userRating: number;
        totalReviews?: number;
        profileImage: string;
        kakaoId: number;
    };
}

export default function UserProfile({ post }: UserProfileProps) {
    return (
        <>
            {/* 유저 프로필 영역 */}
            <div className="mt-7.5 flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-2">
                {/* 아이콘 */}
                <Link
                    href={`/profile/${post.kakaoId}`}
                    className="flex items-center gap-3"
                >
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                        <Image
                            src={
                                post.profileImage
                                    ? post.profileImage
                                    : '/icon/profile/defaultProfile.svg'
                            }
                            alt="유저 프로필 이미지"
                            width={50}
                            height={50}
                            className="z-0 h-full w-full object-cover"
                        />
                    </div>
                    {/* 유저 정보 */}
                    <div className="flex max-w-[300px] min-w-[187px] flex-col items-start gap-1.5">
                        <h1 className="w-full truncate text-base font-semibold text-black">
                            {post.userName}
                        </h1>
                        <div className="flex items-center gap-2 rounded-[24.53px] bg-[#E6E9EB] px-3 py-1.5">
                            <p className="max-w-[140px] truncate text-xs text-[#666666]">
                                {post.statusMessage}
                            </p>
                            <div className="h-1.5 w-px bg-[a0a0a0]/60" />
                            <p className="text-xs text-[#666666]">
                                {/*{convertAgeRange(post.userAge)}*/}
                                {post.userAge}
                            </p>
                            <div className="h-1.5 w-px bg-[A0A0A0]/60" />
                            <p className="text-xs text-[#666666]">
                                {post.userGender}
                            </p>
                        </div>
                    </div>
                </Link>

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
                            {/* 0점이면 0.0으로 표기하지 않음 */}
                            {post.userRating === 0
                                ? `0(${post.totalReviews})`
                                : `${post.userRating.toFixed(1)}(${post.totalReviews})`}
                        </p>
                        ;
                    </div>

                    <p className="text-xs">동행 소감</p>
                </div>
            </div>
        </>
    );
}
