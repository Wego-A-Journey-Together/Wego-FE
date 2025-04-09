import Image from 'next/image';
import Link from 'next/link';

interface UserProfileProps {
    post: {
        userName: string;
        statusMessage: string;
        userAge: number;
        userGender: string;
        userRating: number;
        profileImage: string;
        userId: string;
    };
}

export default function UserProfile({ post }: UserProfileProps) {
    return (
        <>
            {/* 유저 프로필 영역 */}
            <div className="mt-7.5 flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-2">
                {/* 아이콘 */}
                <Link
                    href={`/profile/${post.userId}`}
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
                    <div className="flex w-[187px] flex-col items-start gap-1.5">
                        <h1 className="w-full text-[15px] font-semibold text-black">
                            {post.userName}
                        </h1>
                        <div className="flex items-center gap-2 rounded-[24.53px] bg-[#e5e8ea] px-3 py-1.5">
                            <p className="text-xs text-[#666666]">
                                {post.statusMessage}
                            </p>
                            <div className="h-1.5 w-px bg-gray-300" />
                            <p className="text-xs text-[#666666]">
                                {/*{convertAgeRange(post.userAge)}*/}
                                {post.userAge}{' '}
                            </p>
                            <div className="h-1.5 w-px bg-gray-300" />
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
                            {/*todo:레이팅총개수 */}
                            {`${post.userRating.toFixed(1)}(10)`}
                        </p>
                    </div>

                    <p className="text-xs">동행 리뷰</p>
                </div>
            </div>
        </>
    );
}
