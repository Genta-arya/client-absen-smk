import React from "react";
import Tools from "../../Tools";
import Headers from "../../Headers";
import ButtonNav from "../../ButtonNav";

import ContentUser from "./components/ContentUser";
import useAuthStore from "../../../Lib/Zustand/AuthStore";

const MainUsers = () => {
  const { user } = useAuthStore();
  const role = user?.role;
  return (
    <div>
      <>
        <Tools title={"Dashboard"} role={role} />
        <Headers user={user} />
        <ContentUser />

        <ButtonNav />
      </>
    </div>
  );
};

export default MainUsers;
