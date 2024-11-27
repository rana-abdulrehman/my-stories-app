import { StoryState } from '@/types';
import { create } from 'zustand';

const useStory = create<StoryState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  stories: [],
  addStory: (story) => set((state) => {

    if (state.stories.some((s) => s._id === story._id)) {
      return state;
    }
    return { stories: [...state.stories, story] };
  }),
  updateStory: (_id, updatedStory) =>
    set((state) => ({
      stories: state.stories.map((story) => (story._id === _id ? updatedStory : story)),
    })),
  deleteStory: (_id) =>
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