import React from "react";
import LayoutRender from "./components/LayoutRender";
import useAuthStore from "./Lib/Zustand/AuthStore";

function App() {
  const { user, role, loading } = useAuthStore();

 

  return (
    <>
      {!loading && <LayoutRender role={role} user={user} loading={loading} />}
    </>
  );
}

export default App;
