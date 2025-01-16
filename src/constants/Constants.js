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
  { name: "Dashboard", path: "/", icon: FaHome },
  { name: "Permohonan PKL", path: "/permohonan/list", icon: FaNewspaper },
  { name: "Management User", path: "/user", icon: FaUser },

  { name: "Setting", path: "/settings", icon: FaGear },
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

export const API_URL = "http://localhost:8080/api";
export const API_URL_IMAGE = "http://localhost:8080/uploads/";
