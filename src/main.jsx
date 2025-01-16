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
import MainSetting from "./View/Setting/MainSetting.jsx";
import GantiPassword from "./View/Setting/components/GantiPassword.jsx";
import MainProfile from "./View/Profile/MainProfile.jsx";
import DetailProfile from "./View/Profile/DetailProfile.jsx";

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
      {
        path: "/setting",
        element: <MainSetting />,
      },
      {
        path: "/profil",
        element: <MainProfile />,
      },
      {
        path: "/ganti/password",
        element: <GantiPassword />,
      },
      {
        path: "/detail/profile/:id/:nama",
        element: <DetailProfile />,
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
        path: "/app/setting",
        element: <MainSetting />,
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
