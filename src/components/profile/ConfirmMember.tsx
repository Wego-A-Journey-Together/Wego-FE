import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

interface MemberType {
    id: number;
    profileImage: string;
    userName: string;
    statusMessage: string;
    age: string;
    gender: string;
    isApproved: boolean;
}

interface ConfirmMemberProps {
    currentTabIndex: number;
    members: MemberType[];
}

export default function ConfirmMember({
    members,
    currentTabIndex,
}: ConfirmMemberProps) {
    return (
        <div className="mt-4">
            <div className="text-gray-700">
                {members && members.length > 0 ? (
                    members.map((member, idx) => {
                        return (
                            <div key={member.id} className="mb-4">
                                {/*-------------------------------------------------*/}
                                {/*체크박스, 유저아이콘,문의버튼 한 줄에 해당*/}
                                {/*-------------------------------------------------*/}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <Checkbox />
                                            <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                                                <Image
                                                    src={member.profileImage}
                                                    alt="유저 프로필 이미지"
                                                    width={50}
                                                    height={50}
                                                    className="z-0 h-full w-full object-cover"
                                                />
                                            </div>
                                            {/* 유저 정보 */}
                                            <div className="flex flex-col items-start gap-1.5">
                                                <h1 className="w-full text-[15px] font-semibold text-black">
                                                    {member.userName}
                                                </h1>
                                                <div className="flex items-center gap-2 rounded-[24.53px] bg-[#e5e8ea] px-3 py-1.5">
                                                    <p className="text-xs text-[#666666]">
                                                        {member.statusMessage}
                                                    </p>
                                                    <div className="h-1.5 w-px bg-gray-300" />
                                                    <p className="text-xs text-[#666666]">
                                                        {member.age}
                                                    </p>
                                                    <div className="h-1.5 w-px bg-gray-300" />
                                                    <p className="text-xs text-[#666666]">
                                                        {member.gender}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant={'outline'}
                                        className="h-10 w-[130px] border-[#0ac7e4] text-sm font-semibold text-[#0ac7e4]"
                                    >
                                        <Image
                                            src="/icon/detail/chatIcon.svg"
                                            alt="chat"
                                            width={16}
                                            height={16}
                                            className="mr-1.5"
                                        />
                                        문의 확인하기
                                    </Button>
                                </div>

                                {idx < members.length - 1 && (
                                    <div className="my-4 h-px w-full bg-[#eaeaea]" />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="py-6 text-center text-gray-500">
                        참여하려는 멤버가 없어요
                    </div>
                )}
            </div>
            {/* 하단 체크박스 및 버튼 그룹 */}
            <div className="mt-11 flex items-center justify-between">
                <Checkbox className={'h-7 w-7'} />
                {currentTabIndex === 0 ? (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-[100px] text-xs font-semibold hover:border-rose-500 hover:text-rose-500"
                        >
                            거절하기
                        </Button>
                        <Button
                            size="sm"
                            className="h-10 w-[130px] text-xs font-semibold"
                        >
                            참여 확정하기
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-[100px] text-xs font-semibold hover:border-rose-500 hover:text-rose-500"
                    >
                        거절하기
                    </Button>
                )}
            </div>
        </div>
    );
}
