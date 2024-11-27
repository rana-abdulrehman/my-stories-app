interface User {
    username: string;
    isAdmin: boolean;
    name: string;
    image: string;
    role: string;
};
export interface Story {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
        name: string;
        image: string;
    };
    status: 'approved' | 'pending' | 'rejected';
};
export interface StoryState {
    user: User | null;
    setUser: (user: User | null) => void;
    stories: Story[];
    addStory: (story: Story) => void;
    updateStory: (id: string, updatedStory: Story) => void;
    deleteStory: (id: string) => void;
    login: (user: User) => void;
    logout: () => void;
};

export interface LandingStory {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      name: string;
      image: string;
    };
  }