export interface PostContentProps {
    post: {
        id: number;
        title: string;
        content: string;
        imageSrc: string;

        profileImage: string;
        userName: string;
        statusMessage: string;
        rating: number;
        reviewCount: number;
        age: string;
        gender: string;
        isGroupOpen: boolean;

        startDate: string;
        endDate: string;
        userId: string;
        location: string;

        maxMembers: number;
        currentMembers: number;
        hashtags: string[];
        category: string;
        groupScale: string;
        ageRange: string;
        preferredGender: string;
    };
}
