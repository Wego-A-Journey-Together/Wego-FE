import DropDown from '@/components/profile/DropDown';
import MypageProfile from '@/components/profile/MypageProfile';
import ProfileVisitor from '@/components/profile/ProfileVisitor';
import getCurrentUser from '@/lib/getCurrentUser';
import { notFound } from 'next/navigation';

type Params = { kakaoId: string };

interface ProfilePageProps {
    params: Promise<Params>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { kakaoId } = await params;
    const user = await getCurrentUser();
    // 현재 방문자가 프로필 페이지의 방문자인지, 주인인지 확인하는 변수
    const isVisitor = kakaoId !== String(user?.kakaoId);
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;
    let userData = undefined;

    try {
        const userRes = await fetch(
            `${NEXT_PUBLIC_NEST_BFF_URL}/api/profile/${kakaoId}`,
        );
        if (!userRes.ok) {
            console.error(`API 오류: ${userRes.status}`);
            notFound();
        }

        userData = await userRes.json();

        if (!userData) {
            notFound();
        }
    } catch (e) {
        console.error('프로필 데이터 가져오기 실패:', e);
        notFound();
    }

    return (
        <div className="bg-background-light min-h-screen">
            <main className="flex justify-center pt-10">
                <div className="flex w-full max-w-[1200px] flex-col gap-[70px]">
                    <MypageProfile data={userData} isVisitor={isVisitor} />
                    <section>
                        {/*드롭다운 섹션 ( 동행,동행 소감, 받은 소감 ), 탭 포함*/}
                        {isVisitor ? (
                            <ProfileVisitor kakaoId={Number(kakaoId)} />
                        ) : (
                            <DropDown kakaoId={Number(kakaoId)} />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
