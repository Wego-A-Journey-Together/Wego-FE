import { notFound } from 'next/navigation';

import trendingPost from '../../../../../public/data/trending';

type Params = { userId: string };

interface TestPageProps {
    params: Promise<Params>;
}

export default async function ProfilePage({ params }: TestPageProps) {
    const { userId } = await params;
    const user = trendingPost.find((user) => user.userId === userId);
    if (!user) {
        notFound();
    }
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-3">
            <h1 className={`text-2xl font-black`}>
                {user.userName}개인 페이지에요
            </h1>
            <div className="flex flex-col gap-3">
                <p>
                    민감한 개인정보가 가득
                    {userId}
                </p>
            </div>
        </div>
    );
}
