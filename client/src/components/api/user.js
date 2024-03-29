import axios from "axios";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

/**
 * @POST request
 * @LoginPage
 * http://serverurl/api/auth/user/login
 */
export async function loginUser(usernameInput, password) {
  try {
    const response = await axios.post("/api/auth/user/login", {
      username: usernameInput.current.value,
      password: password.current.value,
    });

    let { token } = response.data;

    localStorage.setItem("token", token);
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @POST request
 * @RegisterPage
 * http://serverurl/api/auth/user/register
 */
export async function registerUser(credentials) {
  const { inputUser, inputPass, inputName, inputEmail } = credentials;

  try {
    await axios.post("/api/auth/user/register", {
      username: inputUser.current.value,
      password: inputPass.current.value,
      fullName: inputName.current.value,
      email: inputEmail.current.value,
    });

    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @PUT request
 * @Profile
 * http://serverurl/api/auth/user/
 */
export async function updateUser(username, password, fullName, email) {
  try {
    await axios.put(`/api/auth/user/${username}`, {
      password,
      email,
      fullName,
    });

    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @GET request
 * http://serverurl/api/auth/user/:id
 */
export async function getUserDetails(searchUserInput) {
  try {
    const token = localStorage.getItem("token");
    if (!token) return console.log("No Token Found");
    let decodedToken = jwtDecode(token);

    const response = await axios.get(
      `api/auth/user/${
        searchUserInput ? searchUserInput : decodedToken.username
      }`
    );

    return response.data;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @POST request
 * @GoogleRegister
 * http://serverurl/api/auth/user/registerGoogle
 */
export async function googleRegister(googleAccessToken) {
  try {
    const googleUserInfo = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken.access_token}`,
        },
      })
      .then((res) => res.data);

    await axios.post(`/api/auth/user/registerGoogle`, {
      googleId: googleUserInfo.sub,
      email: googleUserInfo.email,
      fullName: googleUserInfo.name,
    });

    return { googleRegisterToken: googleAccessToken, googleUserInfo };
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

/**
 * @POST request
 * @GoogleLogin
 * http://serverurl/api/auth/user/loginGoogle
 */
export async function googleLogin(googleAccessToken) {
  try {
    const googleUserInfo = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken.access_token}`,
        },
      })
      .then((res) => res.data);

    const response = await axios.post("/api/auth/user/loginGoogle", {
      googleId: googleUserInfo.sub,
      googleEmail: googleUserInfo.email,
    });

    let { token } = response.data;

    localStorage.setItem("token", token);

    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error.response ? error.response.data.message : error.message);
  }
}

export function getUserId() {
  const token = localStorage.getItem("token");
  let decodedToken = jwtDecode(token);

  return decodedToken;
}

export async function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("googleAccessToken");

  toast.dismiss();
  toast.success("Logged out successfully");
}
