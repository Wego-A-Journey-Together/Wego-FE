import Like from '@/components/Btn/Like';
import RecruitFooter from '@/components/detail/RecruitFooter';
import TabSection from '@/components/detail/TabSection';
import UserProfile from '@/components/detail/UserProfile';
import {
    SpringCommentResponse,
    fetchComments,
} from '@/lib/fetcher/fetchComments';
import { fetchPostDetail } from '@/lib/fetcher/fetchPostDetail';
import { SpringReviewResponse, fetchReviews } from '@/lib/fetcher/fetchReviews';
import { DetailPost } from '@/types/DetailPost';
import Image from 'next/image';
import { notFound } from 'next/navigation';

type Params = { id: string };

interface DetailPageProps {
    params: Promise<Params>;
}

export default async function DetailPage({ params }: DetailPageProps) {
    const { id } = await params;
    let post: DetailPost;
    let firstCommentBundle: SpringCommentResponse;
    let firstReviewBundle: SpringReviewResponse;

    try {
        [post, firstCommentBundle, firstReviewBundle] = await Promise.all([
            fetchPostDetail(id),
            fetchComments(Number(id)),
            fetchReviews(Number(id)),
        ]);
    } catch (error) {
        if ((error as Error).message === '404') {
            notFound();
        }
        console.error('데이터 로딩 실패', error);
        throw new Error('페이지 렌더링 실패');
    }

    return (
        <div className="relative min-h-screen w-full">
            {/*배너*/}
            <section>
                <div className="relative overflow-hidden rounded-[12px] md:h-75 md:w-full">
                    <Image
                        src={post.thumbnailUrl}
                        fill
                        className={`object-cover`}
                        alt={`배경사진`}
                    />
                </div>
            </section>
            {/*제목 섹션 */}
            <section className={`mt-7.5 flex justify-between`}>
                <div>
                    <h1 className={`mb-1 text-2xl font-bold`}>{post.title} </h1>
                    <div className="flex items-center text-sm text-[#666666]">
                        <span>조회수 5</span>
                        <div className="mx-2.5 h-2.5 w-px bg-neutral-400"></div>
                        <span>찜 2</span>
                        <div className="mx-2.5 h-2.5 w-px bg-neutral-400"></div>
                        <span>댓글 3</span>
                    </div>
                </div>
                <Like className={`my-auto px-0`} id={post.id} />
            </section>
            {/*주최자정보섹션*/}
            <section>
                <UserProfile post={post} />
            </section>
            {/*scrollspy 네비게이션 탭 섹션*/}
            <TabSection
                post={post}
                firstCommentBundle={firstCommentBundle}
                firstReviewBundle={firstReviewBundle}
            />
            {/*상세 정보 섹션*/}

            {/*푸터 섹션 (참여하기,문의채팅)*/}
            {/* 푸터 마진 */}
            <div className={`h-20`} />
            <RecruitFooter post={post} />
        </div>
    );
}
