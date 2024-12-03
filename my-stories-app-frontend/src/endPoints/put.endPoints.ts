import { ApprovePendingPostsApiProps, UpdatePostType } from "@/types";
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

export const UpdatePost = async ({ token, postId, postData } : UpdatePostType) => {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_BACK_END_URL}/${UpdatePostUrl}/${postId}`,
            postData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            }
        );
        return response.data;
    } catch (error) {
        
        console.error('Error updating post:', error);
        throw error; 
    }
};