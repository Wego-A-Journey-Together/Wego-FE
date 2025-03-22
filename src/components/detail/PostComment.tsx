import { dateFormat } from '@/lib';
import Image from 'next/image';

import { postComments } from '../../../public/data/comments';

export default function PostComment() {
    const totalComments = postComments.length;
    return (
        <div>
            {/*댓글 헤더*/}
            <h2 className={`mb-7.5 text-xl font-bold text-neutral-950`}>
                댓글 {totalComments}
            </h2>

            {/*댓글 섹션*/}
            {postComments.map((comment, idx) => (
                <div key={`post-comment-${idx}`}>
                    {/*유저 정보 섹션*/}
                    <div className="flex items-center gap-3">
                        {/*유저 이미지*/}
                        <div className="relative aspect-square h-8 w-8">
                            <Image
                                src={comment.userIcon}
                                alt="유저 프로필 이미지"
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>

                        {/* 유저 정보 */}
                        <div className="w-full text-sm font-semibold text-black">
                            {comment.userName}
                        </div>
                    </div>

                    {/*댓글 본문 */}
                    <div className={`mt-2.5`}>
                        <p className={`text-base font-medium text-[#333333]`}>
                            {comment.content}
                        </p>
                    </div>

                    <div className={`mt-2.5 flex justify-start gap-[27px]`}>
                        {/*날짜 섹션*/}
                        <p className={`text-xs font-normal text-[#666666]`}>
                            {dateFormat({ date: comment.updatedAt })}
                        </p>
                        {/*todo: 답글달기 클릭시 답글 입력 (디자이너 분들께 질문하기 )*/}
                        <p
                            className={`cursor-pointer text-xs font-medium text-[#666666]`}
                        >
                            답글달기
                        </p>
                    </div>
                    {/*세퍼레이터*/}
                    <div className="my-5 h-px w-full bg-[#e9e9e9]" />
                </div>
            ))}
        </div>
    );
}
