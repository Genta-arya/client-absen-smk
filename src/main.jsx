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
import InfoAbsensi from "./components/RoleView/Users/Absensi/InfoAbsensi.jsx";
import MainCalendar from "./components/RoleView/Users/Calendar/MainCalendar.jsx";
import MainLaporan from "./components/RoleView/Users/Laporan/MainLaporan.jsx";
import MainFormLaporan from "./components/RoleView/Users/Laporan/MainFormLaporan.jsx";
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import MainFormLaporanMingguan from "./components/RoleView/Users/Laporan/MainFormLaporanMingguan.jsx";
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
        path: "/admin/info/absensi/:id",
        element: <InfoAbsensi />,
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
        path: "/app/laporan/:id",
        element: <MainFormLaporan />,
      },
      {
        path: "/app/laporan/mingguan/:id",
        element: <MainFormLaporanMingguan />,
      },
      {
        path: "/app/setting",
        element: <MainSetting />,
      },
      {
        path: "/app/detail/profile/:id/:nama",
        element: <DetailProfile />,
      },
      {
        path: "/app/ganti/password",
        element: <GantiPassword />,
      },
      {
        path: "/app/info/absensi/:id",
        element: <InfoAbsensi />,
      },
      {
        path: "/app/profil",
        element: <MainProfile />,
      },
      {
        path: "/app/daftar/pkl",
        element: <MainAbsensi />,
      },
      {
        path: "/app/detail/absensi",
        element: <DetailAbsensi />,
      },
      {
        path: "/app/kalender",
        element: <MainCalendar />,
      },
      {
        path: "/app/daftar/laporan",
        element: <MainLaporan />,
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
    <SpeedInsights />
    <Analytics />
    <RouterProvider router={route} />
  </>
);
