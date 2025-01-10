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

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/blog",
      },
      {
        path: "/category",
      },
      {
        path: "/tags",
      },
    ],
  },

  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "/app/blog",
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
  <ThemeProvider>
    <Toaster
      richColors
      position="bottom-center"
      toastOptions={{ style: { fontSize: "14px" }, closeButton: true }}
    />
    <RouterProvider router={route} />
  </ThemeProvider>
);
