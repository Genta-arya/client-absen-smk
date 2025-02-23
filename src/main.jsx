import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NotFound from "./components/NotFound.jsx";
import MainLogin from "./View/Auth/MainLogin.jsx";
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
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import MainFormLaporanMingguan from "./components/RoleView/Users/Laporan/MainFormLaporanMingguan.jsx";
import MainRekababsensi from "./components/RoleView/Pembimbing/RekapAbsensi/MainRekababsensi.jsx";
import { Suspense } from "react";
import Loading from "./components/Loading.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import { Toaster } from "sonner";
import BrowserCheck from "./components/BrowserChceck.jsx";
import CetakLaporanHarian from "./components/RoleView/Users/Laporan/CetakLaporanHarian.jsx";
import CetakLaporanMingguan from "./components/RoleView/Users/Laporan/CetakLaporanMingguan.jsx";
import CetakLaporanRekap from "./components/RoleView/Users/Laporan/CetakLaporanRekap.jsx";
const route = createBrowserRouter([
  {
    path: "/admin",
    element: <ProtectedRoute redirectPath="/login" />,
    children: [
      {
        path: "",
        element: (
          <BrowserCheck>
            <App />
          </BrowserCheck>
        ),
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
      {
        path: "/admin/laporan/:id",
        element: <MainFormLaporan />,
      },
      {
        path: "/admin/laporan/mingguan/:id",
        element: <MainFormLaporanMingguan />,
      },
      {
        path: "/admin/management/pkl/rekap/absensi/:id",
        element: <MainRekababsensi />,
      },
    ],
  },

  {
    path: "/app",
    element: <ProtectedRoute redirectPath="/login" />,
    children: [
      {
        path: "",
        element: (
          <BrowserCheck>
            <App />
          </BrowserCheck>
        ),
      },
      {
        path: "/app/laporan/:id",
        element: <MainFormLaporan />,
      },
      {
        path: "/app/laporan/mingguan/:week/:id",
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
        path: "/app/cetak/laporan/harian/:id",
        element: <CetakLaporanHarian />,
      },
      {
        path: "/app/cetak/laporan/mingguan/:week/:id",
        element: <CetakLaporanMingguan />,
      },
      {
        path: "/app/cetak/laporan/mingguan/rekap/:id",
        element: <CetakLaporanRekap />,
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

const rootElement = document.getElementById("root");

if (!rootElement) {
  document.body.innerHTML = "<div id='error-root'></div>";
  createRoot(document.getElementById("error-root")).render(<ErrorPage />);
} else {
  createRoot(rootElement).render(
    <>
      <Suspense fallback={<Loading />}>
        <Toaster
          richColors
          position="bottom-center"
          toastOptions={{ style: { fontSize: "14px" }, closeButton: true }}
        />

        <RouterProvider router={route} />
      </Suspense>
    </>
  );
}
