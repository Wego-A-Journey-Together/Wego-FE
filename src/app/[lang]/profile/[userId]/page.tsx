import MyGroupPost from '@/components/profile/MyGroupPost';
import MypageProfile from '@/components/profile/MypageProfile';
import Image from 'next/image';
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

                    <section className="flex w-full flex-col gap-[50px]">
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-2xl font-bold">
                                {user.userName}의 동행
                            </h2>
                            <Image
                                width={10}
                                height={10}
                                alt="dropdown icon"
                                src="/icon/profile/dropDown.svg"
                            />
                        </div>

                        {/* TODO 이 줄에 탭 기능 코드 넣으면 됩니다. */}

                        {/* 참여 중인 동행 리스트입니다 */}
                        <MyGroupPost posts={trendingPost} />
                    </section>
                </div>
            </main>
        </div>
    );
}
