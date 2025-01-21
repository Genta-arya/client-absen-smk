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
  { name: "Management PKL", path: "/admin/management/pkl", icon: FaServicestack },
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

// export const API_URL = "http://localhost:8080/api";
export const SOCKET = "https://absensi-pkl.apiservices.my.id";
export const API_URL = "https://absensi-pkl.apiservices.my.id/api";
export const API_URL_IMAGE = "http://localhost:8080/uploads/";
export const UPLOAD_URL = "https://uploads.apiservices.my.id/uploads.php";
export const formatTanggal = (dateString) => {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const date = new Date(dateString);
  const day = days[date.getDay()];

  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  const formattedDate = `${day}, ${date.getDate()} - ${month} - ${date.getFullYear()}`;
  return formattedDate;
};
