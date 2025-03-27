import DropDown from '@/components/profile/DropDown';
import MyGroupPost from '@/components/profile/MyGroupPost';
import MypageProfile from '@/components/profile/MypageProfile';
import { notFound } from 'next/navigation';

import trendingPost from '../../../../../public/data/trending';

type Params = { userId: string };

interface TestPageProps {
    params: Promise<Params>;
}

export default async function ProfilePage({ params }: TestPageProps) {
    const { userId } = await params;
    // 임시데이터 기반 작성
    const user = trendingPost.find((user) => user.userId === userId);
    if (!user) {
        notFound();
    }

    return (
        <div className="bg-background-light min-h-screen">
            <main className="flex justify-center pt-10">
                <div className="flex w-full max-w-[1200px] flex-col gap-[70px]">
                    <MypageProfile user={user} />

                    {/*드롭다운 섹션 ( 동행,동행 소감, 받은 소감 )*/}
                    <section>
                        <DropDown name={user.userName} />
                    </section>

                    {/* TODO 이 줄에 탭 기능 코드 넣으면 됩니다. */}

                    {/* 참여 중인 동행 리스트입니다 */}
                    <section>
                        <MyGroupPost posts={trendingPost} />
                    </section>
                </div>
            </main>
        </div>
    );
}
