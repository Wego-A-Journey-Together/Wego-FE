// api와 일치하는 타입 입니다.
export interface DetailPost {
    id: number;
    title: string;
    filter: {
        startDate: string; // ISO 형식
        endDate: string;
        deadlineDate: string;
        groupTheme: string;
        groupSize: string;
        gender: string;
        age: string[]; // 예: ['20대']
    };
    location: {
        placeName: string;
        latitude: number;
        longitude: number;
    };
    content: string;
    thumbnailUrl: string;
    tags: string[]; // 예: ['#여행', '#맛집']
    currentMembers: number;
    maxMembers: number;

    // 유저 정보
    userId: string;
    userName: string;
    profileImage: string;
    statusMessage: string;
    userAge: number;
    userGender: string;
    userRating: number;
}
