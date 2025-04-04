import getCurrentUser from '@/lib/getCurrentUser';

type Params = { kakaoId: string };

interface Props {
    params: Promise<Params>;
    children: React.ReactNode;
}

// todo: 유저 아이디 조회 api 뚫리면 ~~의 페이지 metadata

export default async function ProfileLayout({ params, children }: Props) {
    const owner = (await params).kakaoId;
    const user = await getCurrentUser();
    // 현재 방문자가 프로필 페이지의 방문자인지, 주인인지 확인하는 변수
    const isVisitor = owner !== user?.kakaoId;

    return (
        <section className="min-h-screen px-4 py-8">
            {isVisitor && '이히히히ㅣ히히'}
            {children}
        </section>
    );
}
