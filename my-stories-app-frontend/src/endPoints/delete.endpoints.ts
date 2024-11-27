import axios from "axios";
import { DeletePostApiUrl } from "./Urls";

  export const DeletePostApi = async ({token,postId}: {token: string | null; postId:string}) => {
    const response = await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/${DeletePostApiUrl}/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response;
  };