export interface DetailPost {
    id: number;
    title: string;
    filter: {
        startDate: string; // ISO 형식
        endDate: string;
        deadlineDate: string;
        deadlineTime: string; // '18:00' 같은 문자열
        groupTheme: string;
        groupSize: string;
        gender: string;
        age: string[]; // 예: ['20대']
    };
    location: {
        placeName: string;
        lat: number;
        lng: number;
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
