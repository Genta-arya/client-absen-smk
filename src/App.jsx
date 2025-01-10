import React from "react";
import Container from "./components/Container";
import LayoutRender from "./components/LayoutRender";


function App() {
  const role = "user";
  return (
    <>
      <LayoutRender role={role} />
    </>
  );
}

export default App;
