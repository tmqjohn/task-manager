import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

import ErrorPage from "./error/ErrorPage";

// components: login
import LoginLayout from "./layout/LoginLayout/LoginLayout";
import LoginPage from "./routes/login/Login";
import RegisterPage from "./routes/login/Register";
import Username from "./routes/login/PasswordReset/Username";
import OTP from "./routes/login/PasswordReset/Code";
import Reset from "./routes/login/PasswordReset/Reset";

// components: main page
import MainInit from "./routes/MainInit";
import MainLayout from "./layout/MainLayout/MainLayout";
import MainPage from "./routes/root/Main";
import ProjectsPage from "./routes/project/Project";

//middleware for protecting routes
import { AuthorizeUser, ProtectedRoute } from "../middleware/Auth";

// react router initialization
const router = createBrowserRouter([
  // main routes / protected when user is not logged in
  {
    path: "/",
    element: (
      <AuthorizeUser>
        <MainLayout />
      </AuthorizeUser>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <MainInit />,
        children: [
          {
            path: "/",
            element: <MainPage />,
          },
          {
            path: "/project/:projectId",
            element: <ProjectsPage />,
          },
        ],
      },
    ],
  },
  // login routes / protected when user is logged in
  {
    path: "/auth/login",
    element: (
      <ProtectedRoute>
        <LoginLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/auth/login",
        element: <LoginPage />,
      },
      {
        path: "/auth/login/register",
        element: <RegisterPage />,
      },
      {
        path: "/auth/login/username",
        element: <Username />,
      },
      {
        path: "/auth/login/otp/:username",
        element: <OTP />,
      },
      {
        path: "/auth/login/passwordreset/:username",
        element: <Reset />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="App">
          <RouterProvider router={router} />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            pauseOnFocusLoss={false}
            draggable={false}
          />
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
