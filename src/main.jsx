import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NotFound from "./components/NotFound.jsx";

import MainLogin from "./View/Auth/MainLogin.jsx";

import { Toaster } from "sonner";

import MainUser from "./View/User/MainUser.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainSetting from "./View/Setting/MainSetting.jsx";
import GantiPassword from "./View/Setting/components/GantiPassword.jsx";
import MainProfile from "./View/Profile/MainProfile.jsx";
import DetailProfile from "./View/Profile/DetailProfile.jsx";
import MainPKL from "./components/RoleView/Pembimbing/MainPKL.jsx";
import CreatePKL from "./components/RoleView/Pembimbing/components/CreatePKL.jsx";
import DetailPkl from "./components/RoleView/Pembimbing/components/DetailPkl.jsx";
import MainAbsensi from "./components/RoleView/Users/Absensi/MainAbsensi.jsx";
import DetailAbsensi from "./components/RoleView/Users/Absensi/DetailAbsensi.jsx";
import MainKelas from "./View/Kelas/MainKelas.jsx";


const route = createBrowserRouter([

  {
    path: "/admin",
    element: <ProtectedRoute redirectPath="/login" />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "/admin/user",
        element: <MainUser />,
      },
      {
        path: "/admin/kelas",
        element: <MainKelas />,
      },
      {
        path: "/admin/setting",
        element: <MainSetting />,
      },
      {
        path: "/admin/profil",
        element: <MainProfile />,
      },
      {
        path: "/admin/ganti/password",
        element: <GantiPassword />,
      },
      {
        path: "/admin/detail/profile/:id/:nama",
        element: <DetailProfile />,
      },
      {
        path: "/admin/management/pkl",
        element: <MainPKL />,
      },
      {
        path: "/admin/management/pkl/create",
        element: <CreatePKL />,
      },
      {
        path: "/admin/management/pkl/detail/:id",
        element: <DetailPkl />,
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
      {
        path: "/app/profil",
        element: <MainProfile />,
      },
      {
        path: "/app/daftar/absensi",
        element: <MainAbsensi />,
      },
      {
        path: "/app/detail/absensi",
        element: <DetailAbsensi />,
      },
    ],
  },

  {
    path: "/",
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
