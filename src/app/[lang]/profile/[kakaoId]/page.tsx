import DropDown from '@/components/profile/DropDown';
import MypageProfile from '@/components/profile/MypageProfile';
import ProfileVisitor from '@/components/profile/ProfileVisitor';
import getCurrentUser from '@/lib/getCurrentUser';
import { notFound } from 'next/navigation';

import trendingPost from '../../../../../public/data/trending';

type Params = { kakaoId: string };

interface ProfilePageProps {
    params: Promise<Params>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { kakaoId } = await params;
    const owner = (await params).kakaoId;
    const user = await getCurrentUser();
    // 현재 방문자가 프로필 페이지의 방문자인지, 주인인지 확인하는 변수
    const isVisitor = owner !== user?.kakaoId;

    // 임시데이터 기반 작성
    const data = trendingPost.find((data) => data.userId === kakaoId);
    if (!data) {
        notFound();
    }

    return (
        <div className="bg-background-light min-h-screen">
            <main className="flex justify-center pt-10">
                <div className="flex w-full max-w-[1200px] flex-col gap-[70px]">
                    <MypageProfile data={data} isVisitor={isVisitor} />
                    <section>
                        {/*드롭다운 섹션 ( 동행,동행 소감, 받은 소감 ), 탭 포함*/}
                        {isVisitor ? <ProfileVisitor /> : <DropDown />}
                    </section>

                    {/* TODO 이 줄에 탭 기능 코드 넣으면 됩니다. */}
                </div>
            </main>
        </div>
    );
}
