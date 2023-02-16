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
    toast.error(
      error.response ? error.response.data.message : console.log(error.message)
    );
  }
}

/**
 * @POST request
 * @RegisterPage
 * http://serverurl/api/auth/register
 */
export async function registerUser(credentials) {
  const { inputUser, inputPass, inputName, inputEmail } = credentials;

  try {
    const response = await axios.post("/api/auth/user/register", {
      username: inputUser.current.value,
      password: inputPass.current.value,
      fullName: inputName.current.value,
      email: inputEmail.current.value,
    });

    toast.dismiss();
    toast.success("Registration successful!");
    toast.success("Try logging into your account");

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
export async function updateUser(id, email, fullName, password) {
  try {
    const response = await axios.put("/api/auth/user", {
      id,
      password: password.current.value,
      email: email.current.value,
      fullName: fullName.current.value,
    });

    toast.dismiss();
    toast.success("Profile updated successfully!");
  } catch (error) {
    console.log(error);
  }
}

/**
 * @GET request
 * http://serverurl/api/auth/user/:id
 */
export async function getUserDetails(username) {
  try {
    const token = localStorage.getItem("token");
    if (!token) return console.log("No Token Found");
    let decodedToken = jwtDecode(token);

    const response = await axios.get(
      `api/auth/user/${username ? username : decodedToken.username}`
    );

    return response.data;
  } catch (error) {
    toast.dismiss();
    toast.error(
      error.response ? error.response.data.message : console.log(error.message)
    );
  }
}

export function getUserId() {
  const token = localStorage.getItem("token");
  let decodedToken = jwtDecode(token);

  return decodedToken;
}

export async function logoutUser() {
  localStorage.removeItem("token");

  toast.dismiss();
  toast.success("Logged out successfully");
}
