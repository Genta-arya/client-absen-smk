import React from "react";
import LayoutRender from "./components/LayoutRender";

import { Toaster } from "sonner";

function App() {
  return (
    <>
      <LayoutRender />
      <Toaster
        richColors
        position="bottom-center"
        toastOptions={{ style: { fontSize: "14px" }, closeButton: true }}
      />
    </>
  );
}

export default App;
