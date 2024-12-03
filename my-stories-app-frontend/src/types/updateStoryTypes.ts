import { Story, StoryCreate } from "./storyTypes";

export interface UpdatePostType {
    token: string | null; 
    postId: string; 
    postData: Story;
}