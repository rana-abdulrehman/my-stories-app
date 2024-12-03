import { Story, StoryCreate } from "./storyTypes";

export interface CreatePostType {
    token: string | null;
    postData: Story;
}