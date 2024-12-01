import { ApprovePendingPostsApiProps, Notification, Story } from "@/types";
import axios from "axios";
import { ApprovePendingPostsApiUrl, DisapprovePendingPostsApiUrl, MarkNotificationAsReadUrl, UpdatePostUrl } from "./Urls";

export const ApprovePendingPostsApi = async ({
    token,
    id
}: ApprovePendingPostsApiProps) => {
    const response: any = await axios.put(`${process.env.REACT_APP_BACK_END_URL}/${ApprovePendingPostsApiUrl}/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

export const DisapprovePendingPostsApi = async ({
    token,
    id
}: ApprovePendingPostsApiProps) => {
    const response: any = await axios.put(`${process.env.REACT_APP_BACK_END_URL}/${DisapprovePendingPostsApiUrl}/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

export const HandleNotificationClickApi = async ({ token, notificationId }: { token: string | null, notificationId: string }) => {
    const response:any = await axios.put(`${process.env.REACT_APP_BACK_END_URL}/notifications/${notificationId}/${MarkNotificationAsReadUrl}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

export const UpdatePost = async ({ token , postId , postData }: { token: string | null; postId : string ; postData: Story } ) => {
    const response = await axios.put(`${process.env.REACT_APP_BACK_END_URL}/${UpdatePostUrl}/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            postData
        }
    });
    return response;
  };
  