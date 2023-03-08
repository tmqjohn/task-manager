import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

/**
 * @POST request
 * http://serverurl/api/group
 */
export async function updateNewChat(newChat, chatId) {
  try {
    await axios.patch(`/api/chat/${chatId}`, {
      newChat,
    });

    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}
