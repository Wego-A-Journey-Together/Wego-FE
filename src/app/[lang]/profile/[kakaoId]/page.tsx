import DropDown from '@/components/profile/DropDown';
import MypageProfile from '@/components/profile/MypageProfile';
import { notFound } from 'next/navigation';

import trendingPost from '../../../../../public/data/trending';

type Params = { kakaoId: string };

interface TestPageProps {
    params: Promise<Params>;
}

export default async function ProfilePage({ params }: TestPageProps) {
    const { kakaoId } = await params;
    // 임시데이터 기반 작성
    const user = trendingPost.find((user) => user.userId === kakaoId);
    if (!user) {
        notFound();
    }

    return (
        <div className="bg-background-light min-h-screen">
            <main className="flex justify-center pt-10">
                <div className="flex w-full max-w-[1200px] flex-col gap-[70px]">
                    <MypageProfile user={user} />

                    {/*드롭다운 섹션 ( 동행,동행 소감, 받은 소감 ), 탭 포함*/}
                    <section>
                        <DropDown name={user.userName} />
                    </section>

                    {/* TODO 이 줄에 탭 기능 코드 넣으면 됩니다. */}
                </div>
            </main>
        </div>
    );
}
