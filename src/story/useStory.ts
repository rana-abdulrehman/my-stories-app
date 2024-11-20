import { create } from 'zustand';


type User = {
  username: string;
  isAdmin: boolean;
};

type Story = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const useStory = create<Story>((set) => ({
  user: null,
  setUser: (user) => set({ user }), 
}));

export default useStory;
