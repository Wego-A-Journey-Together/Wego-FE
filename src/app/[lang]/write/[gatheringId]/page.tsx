import PostForm from '@/components/write/PostForm';

type Params = { gatheringId: string };

interface EditPageProps {
    params: Promise<Params>;
}

export default async function EditPage({ params }: EditPageProps) {
    const { gatheringId } = await params;
    return <PostForm isEdit={true} gatheringId={gatheringId} />;
}
