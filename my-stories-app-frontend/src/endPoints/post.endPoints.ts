import { FetchPendingPostsApiProps, LoginApiProps, LoginResponse, SignupApiProp, Submission } from "@/types";
import axios from "axios";
import { FetchPendingPostsApiUrl, LoginApiUrl, SignupApiUrl } from "./Urls";

export const FetchPendingPostsApi = async ({ token }: FetchPendingPostsApiProps) => {

    const response = await axios.get<Submission[]>(
        `${process.env.REACT_APP_BACK_END_URL}/${FetchPendingPostsApiUrl}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

export const LoginApi = async ({ email, password }: LoginApiProps) => {

    const response = await axios.post<LoginResponse>(`${process.env.REACT_APP_BACK_END_URL}/${LoginApiUrl}`, {
        email,
        password,
    });
    return response;
}

export const SignupApi = async ({ name, email, password }: SignupApiProp) => {

    const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/${SignupApiUrl}`, {
        name,
        email,
        password,
    });
    return response;
}