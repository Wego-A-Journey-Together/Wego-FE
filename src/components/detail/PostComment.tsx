import Image from 'next/image';

import {postComments} from '../../../public/data/comments';

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
                <div className={`mt-7.5`} key={`post-comment-${idx}`}>

                    {/*유저 정보 섹션*/}
                    <div className="flex items-center gap-3">
                        {/*유저 이미지*/}
                        <div className="w-8 h-8 relative aspect-square">
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
                        <p className={`text-[#333333] font-medium text-base`}>{comment.content}</p>
                    </div>
                    {/*날짜 섹션*/}

                    <div className={`mt-2.5`}>
                        <p className={`text-[#666666] font-normal text-xs`}>{comment.updatedAt.toString()}</p>
                    </div>
                </div>
            ))}
            <h2 className={`mb-7.5 text-xl font-bold text-neutral-950`}>
                댓글 {totalComments}
            </h2>
            <h2 className={`mb-7.5 text-xl font-bold text-neutral-950`}>
                댓글 {totalComments}
            </h2>
            <h2 className={`mb-7.5 text-xl font-bold text-neutral-950`}>
                댓글 {totalComments}
            </h2>
            <h2 className={`mb-7.5 text-xl font-bold text-neutral-950`}>
                댓글 {totalComments}
            </h2>
        </div>
    );
}
