import {
  FaHome,
  FaServicestack,
  FaNewspaper,
  FaTag,
  FaComment,
  FaUser,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

export const menuItems = [
  { name: "Dashboard", path: "/admin", icon: FaHome },
  { name: "Permohonan PKL", path: "/admin/permohonan/list", icon: FaNewspaper },
  { name: "Management User", path: "/admin/user", icon: FaUser },
  {
    name: "Management PKL",
    path: "/admin/management/pkl",
    icon: FaServicestack,
  },
  { name: "Setting", path: "/admin/setting", icon: FaGear },
];

export const modalTypes = {
  edit: "Edit",
  delete: "Delete",
  create: "Create",
};

export const Text = "text-xs md:text-sm lg:text-sm";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// export const API_URL = "http://localhost:8081/api";
// export const SOCKET = "http://localhost:8081";


// export const SOCKET = "https://absensi-pkl.apiservices.my.id";
// export const API_URL = "https://absensi-pkl.apiservices.my.id/api";

export const API_URL = "https://pkl.apiservices.my.id/api";
export const SOCKET = "https://pkl.apiservices.my.id";

export const API_URL_IMAGE = "https://pkl.apiservices.my.id/uploads/";
export const UPLOAD_URL = "https://cloud.mystorages.my.id/uploads.php";

export const formatTanggal = (dateString) => {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const date = new Date(dateString);

  // Menyesuaikan ke UTC+7
  const utc7Date = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const day = days[utc7Date.getUTCDay()];
  const month = (utc7Date.getUTCMonth() + 1).toString().padStart(2, "0");
  const dayOfMonth = utc7Date.getUTCDate().toString().padStart(2, "0");
  const year = utc7Date.getUTCFullYear();

  const formattedDate = `${day}, ${dayOfMonth}/${month}/${year}`;
  return formattedDate;
};
