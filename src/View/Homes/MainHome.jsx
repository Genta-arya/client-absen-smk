import React from "react";
import Headers from "../../components/Headers";
import Tools from "../../components/Tools";
import Charts from "./components/Charts";
import MainPengumuman from "./MainPengumuman";

const MainHome = ({ role, user }) => {
  return (
    <div>
      <>
        <Tools title={"Dashboard"} />
        <Headers role={role} user={user} />


        <MainPengumuman />


        {/* <Charts /> */}
      </>
    </div>
  );
};

export default MainHome;
