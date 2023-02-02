import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

/**
 * @POST request
 * @LoginPage
 * http://serverurl/api/auth/login
 */
export async function loginUser(e, username, password, navigate) {
  e.preventDefault();

  // GET method
  // const { data } = await axios.get("/api/auth/login");

  // console.log(data);

  //POST method
  // console.log(inputUser.current.value);
  try {
    const result = await axios.post("/api/auth/login", {
      username: username.current.value,
      password: password.current.value,
    });

    let { token } = result.data;
    localStorage.setItem("token", token);

    console.log(result.data);

    navigate("/");
  } catch (error) {
    toast.dismiss();
    toast.error(error.response.data.message);
  }
}

/**
 * @POST request
 * @RegisterPage
 * http://serverurl/api/auth/register
 */
export async function registerUser(e, credentials, navigate) {
  e.preventDefault();

  const { inputUser, inputPass, inputName, inputEmail } = credentials;

  try {
    const result = await axios.post("/api/auth/register", {
      username: inputUser.current.value,
      password: inputPass.current.value,
      fullName: inputName.current.value,
      email: inputEmail.current.value,
    });

    console.log(result.data);

    toast.dismiss();
    toast.success("Registration successful!");
    toast.success("Try logging into your account");

    navigate("/auth/login");
  } catch (error) {
    toast.dismiss();
    toast.error(error.response.data.message);
  }
}
