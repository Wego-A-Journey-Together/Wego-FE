import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { PostContentProps } from '@/types/PostContent';
import { Calendar, MoreHorizontal, Star, X } from 'lucide-react';

import ChatList from './ChatList';
import ChatNotice from './ChatNotice';

interface UserChatProps extends PostContentProps {
    onClose?: () => void;
    onParticipate?: () => void;
}

export default function UserChat({
    post,
    onClose,
    onParticipate,
}: UserChatProps) {
    return (
        <div className="bg-background-light flex h-full flex-col">
            {/* 채팅창 헤더 */}
            <SheetHeader className="flex h-[72px] w-full flex-row items-center justify-between px-5 py-2.5">
                <button
                    className="flex h-6 w-6 cursor-pointer items-center justify-center"
                    onClick={onClose}
                    aria-label="창 닫기"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="inline-flex items-center gap-1">
                    {/* 유저 아이디 */}
                    <SheetTitle className="m-0 text-[15px] font-semibold text-black">
                        {post.userName}
                    </SheetTitle>

                    <div className="inline-flex items-center gap-1 rounded-[50px] bg-[#ffd8001a] px-2 py-1 text-[#614e03]">
                        <Star className="h-4 w-4 fill-[#FFD800] text-[#FFD800]" />

                        {/* 유저 평점 */}
                        <span className="text-xs font-medium">
                            {post.rating}
                        </span>
                    </div>
                </div>

                <button
                    className="flex h-6 w-6 items-center justify-center"
                    aria-label="MoreHorizontal options"
                >
                    <MoreHorizontal className="h-5 w-5 cursor-pointer text-[#333333]" />
                </button>
            </SheetHeader>

            {/* 게시글 제목, 상태, 참여하기 버튼 섹션 */}
            <section className="flex w-full flex-col gap-2.5 border-b px-5 py-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex w-[365px] flex-col gap-[3px]">
                        <h2 className="text-base font-semibold">
                            {post.title}
                        </h2>
                        <div className="flex items-center gap-[3px]">
                            <Calendar className="h-4 w-4 text-[#666666]" />
                            <SheetDescription className="m-0 text-sm font-normal whitespace-nowrap text-[#666666]">
                                {`${post.startDate} - ${post.endDate}`}
                            </SheetDescription>
                        </div>
                    </div>

                    <Button className="px-[30px] py-2" onClick={onParticipate}>
                        참여하기
                    </Button>
                </div>
            </section>

            {/* 채팅 말풍선 섹션 */}
            <section className="flex-1 overflow-y-auto p-4">
                {/* TODO 조건 부분에 대화 내역이 있는지 없는지 반환 필요. */}
                {true ? <ChatList /> : <ChatNotice />}
            </section>

            {/* 메세지 입력 영역 */}
            <SheetFooter className="flex flex-col items-center justify-center gap-2.5 bg-white px-2.5 py-5">
                <div className="w-full rounded-xl border-solid bg-[#f9f9f9]">
                    <div className="p-5">
                        <div className="flex flex-col gap-10">
                            <Input
                                placeholder="메세지를 입력하세요"
                                className="border-none bg-transparent text-base leading-[20.8px] font-normal text-[#999999] shadow-none focus-visible:ring-0"
                            />
                            <div className="flex w-full items-center justify-end gap-2">
                                <Button className="px-5 py-2">전송</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetFooter>
        </div>
    );
}
