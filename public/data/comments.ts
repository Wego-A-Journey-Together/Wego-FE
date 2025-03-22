/**
 * todo:
 * 프론트에서 사용시에 댓글 목록을 중첩 객체로 가져오는 것이 유리 하다고 판단하여
 * replies 필드를 선언 -> bff에서 이렇게 수정 하던지 백엔드에서 제공 하던지 살펴봐야 할 것 같습니다.
 */
interface PostComments {
    commentId: number;
    postId: number;
    userId: number;
    userName: string;
    userIcon: string;
    content: string;
    updatedAt: Date;
    parentId: number | null;
    replies?: PostComments[];
}

const replyComments: PostComments[] = [
    {
        commentId: 5,
        postId: 1,
        userId: 1,
        userName: '김동키',
        userIcon: '/image/dogProfile.png',
        content: '네 한시 어떠세요',
        updatedAt: new Date('2025-03-24T20:50:00'),
        parentId: 1,
    },
    {
        commentId: 6,
        userId: 1,
        postId: 1,

        userName: '김동키',
        userIcon: '/image/dogProfile.png',
        content: '네 한시',
        updatedAt: new Date('2025-03-24T20:50:00'),
        parentId: 2,
    },
    {
        commentId: 7,
        userId: 1,
        postId: 1,

        userName: '김동키',
        userIcon: '/image/dogProfile.png',
        content: '한시 어떠냐구요',
        updatedAt: new Date('2025-03-24T20:50:00'),
        parentId: 3,
    },
    {
        commentId: 8,
        userId: 1,
        postId: 1,
        userName: '김동키',
        userIcon: '/image/dogProfile.png',
        content: '차단',
        updatedAt: new Date('2025-03-24T20:50:00'),
        parentId: 4,
    },
];

export const postComments: PostComments[] = [
    {
        commentId: 1,
        postId: 1,
        userId: 10,
        userIcon: '/image/dogProfile.png',
        userName: '귀여운 동행자',
        content: '혹시 3.24일 점심만 같이 하는건 어떠세요?',
        updatedAt: new Date('2025-03-24T20:45:00'),
        parentId: null,
        replies: [replyComments[0]],
    },
    {
        commentId: 2,
        postId: 1,
        userId: 10,
        userIcon: '/image/dogProfile.png',
        userName: '귀여운 동행자',
        content: '혹시 3.24일 점심만 같이 하는건 어떠세요?',
        updatedAt: new Date('2025-03-24T20:46:00'),
        parentId: null,
        replies: [replyComments[1]],
    },
    {
        commentId: 3,
        postId: 1,
        userId: 10,
        userIcon: '/image/dogProfile.png',
        userName: '귀여운 동행자',
        content: '혹시 3.24일 점심만 같이 하는건 어떠세요?',
        updatedAt: new Date('2025-03-24T20:47:00'),
        parentId: null,
        replies: [replyComments[2]],
    },
    {
        commentId: 4,
        postId: 1,
        userId: 10,
        userIcon: '/image/dogProfile.png',
        userName: '귀여운 동행자',
        content: '혹시 3.24일 점심만 같이 하는건 어떠세요?',
        updatedAt: new Date('2025-03-24T20:48:00'),
        parentId: null,
        replies: [replyComments[3]],
    },
    replyComments[0],
    replyComments[1],
    replyComments[2],
    replyComments[3],
];
