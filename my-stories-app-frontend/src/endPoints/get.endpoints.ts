import axios from "axios";
import { FetchNotificationsApiUrl, FetchStoriesApiUrl, FetchUserPostsUrl } from "./Urls";
import { Story , Notification, LandingStory } from "@/types";


export const FetchUserPostsApi = async ({ token }: { token: string | null }) => {
  const response = await axios.get<Story[]>(`${process.env.REACT_APP_BACK_END_URL}/${FetchUserPostsUrl}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const FetchPostByIdApi = async ({token,postId}: {token: string | null; postId:string}) => {
  const response = await axios.get<Story>(`${process.env.REACT_APP_BACK_END_URL}/${FetchUserPostsUrl}/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const FetchNotificationsApi = async ({ token }: { token: string | null }) => {
  const response = await axios.get<Notification[]>(`${process.env.REACT_APP_BACK_END_URL}/${FetchNotificationsApiUrl}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export const FetchStoriesApi = async () => {
 const response = await axios.get<LandingStory[]>(`${process.env.REACT_APP_BACK_END_URL}/${FetchStoriesApiUrl}`);
 return response;
}