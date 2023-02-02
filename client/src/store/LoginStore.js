import { create } from "zustand";

const LoginStore = create((set) => ({
  isLogin: true,
}));

export default LoginStore;
