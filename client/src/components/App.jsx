import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// components: login
import ErrorPage from "./error/ErrorPage";
import LoginLayout from "./layout/LoginLayout";
import LoginPage from "./login/LoginPage";
import RegisterPage from "./login/RegisterPage";

//// components: main page
import MainPage from "./main/Main";

//middleware
import { AuthorizeUser, ProtectedRoute } from "../middleware/Auth";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthorizeUser>
        <MainPage />
      </AuthorizeUser>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth",
    element: (
      <ProtectedRoute>
        <LoginLayout />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          pauseOnFocusLoss={false}
          draggable={false}
        />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/auth/login",
        element: <LoginPage />,
      },
      {
        path: "/auth/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
