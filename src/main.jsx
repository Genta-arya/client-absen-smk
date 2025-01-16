import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import NotFound from "./components/NotFound.jsx";
import { ThemeProvider } from "./components/Theme.jsx";
import MainLogin from "./View/Auth/MainLogin.jsx";

import { Toaster } from "sonner";

import MainUser from "./View/User/MainUser.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute redirectPath="/login" />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "/user",
        element: <MainUser />,
      },
    ],
  },

  {
    path: "/app",
    element: <ProtectedRoute redirectPath="/login" />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "/app/user",
        element: <MainUser />,
      },
    ],
  },

  {
    path: "/login",
    element: <MainLogin />,
  },

  {
    path: "*",

    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <>
    <Toaster
      richColors
      position="bottom-center"
      toastOptions={{ style: { fontSize: "14px" }, closeButton: true }}
    />
    <RouterProvider router={route} />
  </>
);
