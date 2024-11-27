export interface Submission {
    _id: string;
    title: string;
    content: string;
    status: 'pending' | 'approved' | 'disapproved';
    author: {
        name: string;
        image?: string;
    };
    createdAt: string;
}