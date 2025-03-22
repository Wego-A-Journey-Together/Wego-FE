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
                <div className={`mt-7.5`} key={`post-comment-${idx}`}>
                    {/*유저 정보 섹션*/}
                    <div className="flex items-center gap-3">
                        <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                            <Image
                                src={comment.userIcon}
                                alt="유저 프로필 이미지"
                                width={50}
                                height={50}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* 유저 정보 */}
                        <div className="w-full text-[15px] font-semibold text-black">
                            {comment.userName}
                        </div>
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
