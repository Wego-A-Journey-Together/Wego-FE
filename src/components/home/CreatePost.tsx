import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreatePost() {
    return (
        <div className="col-span-full mx-auto w-[380px]">
            <div className="mt-40 mb-[329px] flex flex-col items-center gap-[30px]">
                <p className="text-center text-base font-medium text-gray-500">
                    조건에 부합하는 동행이 없어요.
                    <br />
                    내가 원하는 동행을 만들어보세요!
                </p>

                <Link href={'/write'} className="w-[380px]">
                    <Button className="h-[59px] w-[380px] text-lg font-bold">
                        내가 원하는 동행글 작성하기
                    </Button>
                </Link>
            </div>
        </div>
    );
}
