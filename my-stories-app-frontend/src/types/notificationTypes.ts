export interface Notification {
    _id: string;
    type: string;
    postId: string;
    message: string;
    read: boolean;
    createdAt: string;
  }