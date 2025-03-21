export interface PostContentProps {
    post: {
        id: number;
        title: string;
        content: string;

        userName: string;
        statusMessage: string;
        rating: number;
        reviewCount: number;
        age: string;
        gender: string;

        startDate: string;
        endDate: string;
    };
}
