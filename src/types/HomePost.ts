//todo : gender쪽 필드명이 달라서 이후에 지울 타입 입니다.
export interface HomePost {
    id: number;
    title: string;
    content: string;
    thumbnailUrl: string | null;
    filter: {
        startDate: string;
        endDate: string;
        deadlineDate: string;
        groupTheme: string;
        groupSize: string;
        gender: string | null;
        age: string[];
    };
    location: {
        placeName: string;
        lat: number;
        lng: number;
    };
    tags: string[];
    currentMembers: number;
    maxMembers: number;
    userId: string;
    userName: string;
    profileImage: string;
    statusMessage: string;
    userAge: number;
    gender: string;
}
