import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface RecruitFooterProps {
    title: string;
}

export default function RecruitFooter({ title }: RecruitFooterProps) {
    return (
        <footer className="fixed right-0 bottom-0 left-0 w-full bg-white py-5 drop-shadow-2xl">
            <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4">
                <div className="flex items-center gap-1.5">
                    <Badge>동행구함</Badge>
                    <p className="text-base font-semibold text-black">
                        {title}
                    </p>
                </div>

                <div className="flex items-center gap-5">
                    <Button
                        variant="outline"
                        className="h-9 w-[100px] border-[#0ac7e4] text-sm font-semibold text-[#0ac7e4]"
                    >
                        <Image
                            src="/icon/detail/chatIcon.svg"
                            alt="chat"
                            width={16}
                            height={16}
                            className="mr-1.5"
                        />
                        문의하기
                    </Button>
                    <Button className="h-9 w-[150px]">참여하기</Button>
                </div>
            </div>
        </footer>
    );
}
