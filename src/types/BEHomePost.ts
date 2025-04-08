export type BEHomePost = {
    id: number;
    title: string;
    content: string;
    thumbnailUrl: string;
    startAt: string;
    endAt: string;
    closedAt: string;
    maxParticipants: number;
    location: string;
    preferredGender: 'ANY' | 'MALE' | 'FEMALE';
    preferredAge: 'ALL' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | string;
    category: string;
    hashtags: string[];
    creator: {
        nickname: string;
        thumbnailUrl: string;
        statusMessage: string;
        gender: string;
        ageGroup: string;
    };
};
