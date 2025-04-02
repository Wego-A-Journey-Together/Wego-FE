export interface HomePost {
    id: number;
    title: string;
    content: string;
    thumbnailUrl: string | null;
    filter: {
        startDate: Date;
        endDate: Date;
        deadlineDate: Date;
        deadlineTime: Date;
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
