'use client';

import ReviewRating from '@/components/detail/ReviewRating';
import ReviewImageUploader from '@/components/profile/ReviewImageUploader';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useGetMyProfile from '@/hooks/fetch/useGetMyProfile';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

interface User {
    kakaoId: string;
    nickname: string;
    thumbnailUrl: string;
    statusMessage: string;
    ageGroup: string;
    gender: string;
}

interface ReviewEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
    gatheringId: number;
}

export default function ReviewEditor({
    open,
    onOpenChange,
    gatheringId,
}: ReviewEditorProps) {
    const [rating, setRating] = useState(3);
    const [feedback, setFeedback] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { myProfile: user, loading } = useGetMyProfile();
    if (loading)
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
            </div>
        );
    if (!user) return null;

    const resetForm = () => {
        setRating(3);
        setFeedback('');
        setImage(null);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/reviews/${gatheringId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        rating,
                        content: image
                            ? `${feedback}\nIMAGE:${image}`
                            : feedback,
                    }),
                },
            );

            if (!res.ok) throw new Error('리뷰 등록 실패');

            toast.success('리뷰가 등록되었습니다.');
            onOpenChange(false);
            resetForm();
        } catch (error) {
            toast.error('리뷰 등록 중 오류가 발생했습니다.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        setRating(3);
        setFeedback('');
        setImage(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="h-[714px] w-[500px] border border-[#E0E0E0] p-0 shadow-[0_0_15px_rgba(0,0,0,0.06)]">
                <DialogHeader className="flex h-[47px] items-center justify-between border-b [border-bottom-style:solid] border-[#e9e9e9] px-[30px] py-2.5">
                    <DialogTitle className="w-full text-center text-base font-bold">
                        동행 소감 남기기
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    별점과 후기를 작성하고 제출할 수 있습니다.
                </DialogDescription>

                <div className="flex flex-col">
                    {/* 유저 프로필 */}
                    <div className="flex items-center gap-3 px-[30px]">
                        <div className="h-[42px] w-[42px] overflow-hidden rounded-full">
                            <Image
                                src={user.thumbnailUrl}
                                alt="user profile"
                                width={42}
                                height={42}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-xl font-bold">
                                {user.nickname}
                            </div>

                            <div className="flex items-center gap-2 rounded-full bg-[#e5e8ea] px-3 py-1.5 font-normal text-[#666666]">
                                {/* 유저 주요 정보 */}
                                <div className="flex items-center text-xs">
                                    {user.statusMessage}
                                </div>
                                <hr className="mx-1 h-1.5 w-px bg-[#666666]"></hr>
                                <div className="flex items-center text-xs">
                                    {user.ageGroup}
                                </div>
                                <hr className="mx-1 h-1.5 w-px bg-[#666666]"></hr>
                                <div className="flex items-center text-xs">
                                    {user.gender}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="mt-[30px] h-1.5 w-full bg-[#f5f6f7]"></hr>

                    <div className="mt-[30px] flex w-full flex-col items-center">
                        <h1 className="text-center text-base font-bold">
                            참여하신 동행은 만족하셨나요?
                        </h1>

                        {/* 별 아이콘을 눌러 별점 추가하기 */}
                        <div className="relative mt-2">
                            <div className="flex items-start gap-1">
                                <div>
                                    <ReviewRating rating={rating} />
                                </div>
                            </div>
                            {/* 실제 동작 버튼 */}
                            <span className="absolute top-0 left-0 z-10 flex items-start gap-1">
                                {[1, 2, 3, 4, 5].map((starButton) => (
                                    <button
                                        key={starButton}
                                        className="h-9 w-9 cursor-pointer"
                                        onClick={() => setRating(starButton)}
                                    ></button>
                                ))}
                            </span>
                        </div>
                    </div>

                    {/* 리뷰 작성 */}
                    <div className="mt-[30px] flex w-full flex-col items-center gap-2">
                        <h2 className="text-center text-base leading-6 font-bold">
                            즐거운 동행을 열어준
                            <br />
                            주최자에게 소중한 한마디를 남겨보세요.
                        </h2>
                        <div className="relative w-[440px]">
                            <Textarea
                                className="h-[170px] w-full resize-none rounded-lg bg-[#f5f6f7] p-4 pb-8 text-xs"
                                placeholder={`낯설지만 설레고 소중했던 동행자와의 추억을 남겨보세요.
(최소 10자 이상)`}
                                value={feedback}
                                maxLength={5000}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                            <div className="-mt-7 mr-4 text-right text-xs font-normal text-[#999999]">
                                {feedback.length.toLocaleString()} / 5,000
                            </div>
                        </div>
                    </div>

                    {/* 사진 첨부 버튼 */}
                    <ReviewImageUploader
                        onImageSelect={setImage}
                        initialImage={image ?? undefined}
                    />

                    <hr className="mt-[30px] h-1.5 w-full bg-[#f5f6f7]"></hr>

                    {/* 취소, 등록 버튼 */}
                    <div className="mx-auto mt-[20px] flex h-[52px] w-[440px] items-start gap-2">
                        <Button
                            variant="outline"
                            className="h-[52px] w-[216px] border-[#e9e9e9]"
                            onClick={handleCancel}
                        >
                            취소
                        </Button>

                        <Button
                            disabled={feedback.length < 10 || isSubmitting}
                            variant={
                                feedback.length < 10 ? 'darkGray' : 'default'
                            }
                            className="h-[52px] w-[216px] text-sm font-semibold text-white"
                            onClick={handleSubmit}
                        >
                            등록
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
