import React from "react";
import Headers from "../../components/Headers";
import Tools from "../../components/Tools";
import Charts from "./components/Charts";

const MainHome = () => {
  return (
    <div>
      <Tools title={"Dashboard"} />
      <Headers />
      <Charts />
    </div>
  );
};

export default MainHome;
