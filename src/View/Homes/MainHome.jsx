import React from "react";
import Headers from "../../components/Headers";
import Tools from "../../components/Tools";
import Charts from "./components/Charts";

const MainHome = ({ role, user }) => {
  return (
    <div>
      <>
        <Tools title={"Dashboard"} />
        <Headers role={role} user={user} />
        {/* <Charts /> */}
      </>
    </div>
  );
};

export default MainHome;
