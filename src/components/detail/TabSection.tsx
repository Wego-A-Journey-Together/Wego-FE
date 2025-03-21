import { PostDeatil } from '@/app/[lang]/detail/[id]/types';
import Tab from '@/components/detail/Tab';

interface TabSectionProps {
    post: PostDeatil;
}

export default function TabSection({ post }: TabSectionProps) {
    return (
        <>
            {/*탭 섹션*/}
            <section
                className={`sticky top-18 mt-17.5 border-b border-b-[#AAAAAAA]`}
            >
                <p className={`sr-only`}>탭그룹</p>
                <Tab />
            </section>

            <div className="flex h-[400vh] flex-col gap-3">
                <p>id: {post.id}</p>
                <p>title: {post.title}</p>
                <p>userName: {post.userName}</p>
                <p>age: {post.age}</p>
                <p>gender: {post.gender}</p>
                <p>startDate: {post.startDate}</p>
                <p>endDate: {post.endDate}</p>
            </div>
        </>
    );
}
