import { create } from 'zustand';

type User = {
  username: string;
  isAdmin: boolean;
  name: string;
  image: string;
  role: string; 
};

type Story = {
  _id: string; // Change this from 'id' to '_id'
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image: string;
  };
  status: 'approved' | 'pending' | 'rejected';
};

type StoryState = {
  user: User | null;
  setUser: (user: User | null) => void;
  stories: Story[];
  addStory: (story: Story) => void;
  updateStory: (id: string, updatedStory: Story) => void; // Change this from 'id' to '_id'
  deleteStory: (id: string) => void; // Change this from 'id' to '_id'
  login: (user: User) => void;
  logout: () => void;
};

const useStory = create<StoryState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  stories: [],
  addStory: (story) => set((state) => ({ stories: [...state.stories, story] })),
  updateStory: (_id, updatedStory) => // Change this from 'id' to '_id'
    set((state) => ({
      stories: state.stories.map((story) => (story._id === _id ? updatedStory : story)),
    })),
  deleteStory: (_id) => // Change this from 'id' to '_id'
    set((state) => ({
      stories: state.stories.filter((story) => story._id !== _id),
    })),
  login: (user) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
}));

export default useStory;