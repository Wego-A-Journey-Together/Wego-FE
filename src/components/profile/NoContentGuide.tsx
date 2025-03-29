import { Button } from '@/components/ui/button';

export default function NoContentGuide() {
    return (
        <div className="flex flex-col items-center gap-5 p-4">
            <h2 className="text-center text-xl font-bold">
                참여 중인 동행이 없어요
            </h2>

            <Button className="h-[61px] w-[358px] px-[130px] py-2">
                <span className="text-lg font-semibold">동행 구경하기</span>
            </Button>
        </div>
    );
}
