import create from 'zustand';

type User = {
  username: string;
  isAdmin: boolean;
};

type Store = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user:User) => set({ user }), 
}));

export default useStore;
