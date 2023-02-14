import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ErrorPage from "./error/ErrorPage";

// components: login
import LoginLayout from "./layout/LoginLayout/LoginLayout";
import LoginPage from "./routes/login/Login";
import RegisterPage from "./routes/login/Register";

// components: main page
import MainLayout from "./layout/MainLayout/MainLayout";
import MainPage from "./routes/root/Main";
import ProjectsPage from "./routes/project/Project";

//middleware
import { AuthorizeUser, ProtectedRoute } from "../middleware/auth";

const router = createBrowserRouter([
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
        element: <MainPage />,
      },
      {
        path: "/project/:projectId",
        element: <ProjectsPage />,
      },
    ],
  },
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
    ],
  },
]);

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnFocusLoss={false}
        draggable={false}
      />
    </div>
  );
};

export default App;
