interface PostReview {
    reviewId: number;
    postId: number;
    postImage: string;
    userId: number;
    userName: string;
    userIcon: string;
    content: string;
    updatedAt: Date;
    rating: number; //todo: 1~5사이 별점
}

export const postReviews: PostReview[] = [
    {
        reviewId: 1,
        postId: 1,
        postImage: '/image/jejuGirl.png',
        userId: 1,
        userName: '김동키',
        userIcon: '/image/dogProfile.png',
        content: '너무 즐거웠어요',
        updatedAt: new Date('2025-03-28T20:50:00'),
        rating: 5,
    },
    {
        reviewId: 2,
        postId: 1,
        postImage: '/image/jejuGirl.png',
        userId: 1,
        userName: '김동키',
        userIcon: '/image/dogProfile.png',
        content: '쏘쏘',
        updatedAt: new Date('2025-03-29T20:50:00'),
        rating: 2.8,
    },
    {
        reviewId: 3,
        postId: 1,
        postImage: '',
        userId: 1,
        userName: '김동키',
        userIcon: '/image/dogProfile.png',
        content: '6점짜린데 5점까지 있어서 한 개 드립니다.',
        updatedAt: new Date('2025-03-30T20:50:00'),
        rating: 1,
    },
];
