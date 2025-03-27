import { StarIcon } from 'lucide-react';
import Image from 'next/image';

interface User {
    userName: string;
    statusMessage: string;
    location: string;
    age: string;
    gender: string;
    rating: number;
    reviewCount: number;
    profileImage: string;
}

interface MypageProfileProps {
    user: User;
}

export default function MypageProfile({ user }: MypageProfileProps) {
    const profileData = {
        name: user.userName,
        status: user.statusMessage,
        location: user.location,
        age: user.age,
        gender: user.gender,
        rating: user.rating,
        reviews: user.reviewCount,
        profileImage: user.profileImage,
    };

    return (
        <section className="flex w-full flex-col gap-10">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold text-black">프로필</h1>
            </div>

            <div className="flex w-full items-start justify-between">
                {/* 프로필 정보 */}
                <div className="flex items-center gap-3">
                    <div className="relative h-24 w-24">
                        <Image
                            className="rounded-full object-cover"
                            alt="Profile"
                            src={
                                profileData.profileImage ||
                                '/icon/profile/defaultProfile.svg'
                            }
                            fill
                            sizes="96px"
                            priority
                        />

                        <div className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-[14px] border border-solid border-[#d9d9d9] bg-white">
                            <Image
                                alt="edit"
                                width={18}
                                height={18}
                                src="/icon/profile/profileEdit.svg"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-[#005ECA]">
                                프로필 작성 완료
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-black">
                            {profileData.name}
                        </h2>

                        <div className="inline-flex items-center rounded-[24.53px] bg-[#e5e8ea] px-4 py-1.5 font-normal text-[#666666]">
                            <span>{profileData.status}</span>
                            <div className="mx-3 inline-block h-2 w-px bg-current"></div>
                            <span>{profileData.age}</span>
                            <div className="mx-3 inline-block h-2 w-px bg-current"></div>
                            <span>{profileData.gender}</span>
                        </div>
                    </div>
                </div>

                <div className="flex h-[95px] w-[200px] flex-col items-end justify-center gap-[3px] py-4">
                    <span className="text-right text-xs text-[#666666]">
                        동행 소감 관리
                    </span>
                    <div className="flex w-full items-center justify-end gap-1">
                        <StarIcon className="h-8 w-8 fill-current text-[#FFD700]" />
                        <span className="text-right text-[28px] font-semibold text-[#333333]">
                            {profileData.rating.toFixed(1)}(
                            {profileData.reviews})
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
