import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

/**
 * @POST request
 * http://serverurl/api/auth/recovery/generateOTP
 */
export async function generateOtp(username) {
  try {
    const response = await axios.post("api/auth/user/recovery/generateotp", {
      username,
    });

    return response.data;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @POST request
 * http://serverurl/api/auth/recover/verifyotp
 */
export async function verifyOtp(code) {
  try {
    const response = await axios.post("/api/auth/user/recovery/verifyotp", {
      code,
    });

    return response.data;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @PUT request
 * http://serverurl/api/auth/resetPassword/:username
 */
export async function resetPassword(username, password) {
  try {
    const response = await axios.put(
      `api/auth/user/resetPassword/${username}`,
      {
        password,
      }
    );

    return response.data;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}
