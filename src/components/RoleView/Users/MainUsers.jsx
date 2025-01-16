import React from "react";
import Tools from "../../Tools";
import Headers from "../../Headers";
import ButtonNav from "../../ButtonNav";

import ContentUser from "./components/ContentUser";

const MainUsers = ({ role, user, loading }) => {
  return (
    <div>
      {!loading && (
        <>
          <Tools title={"Dashboard"} role={role} />
          <Headers role={role} />
          <ContentUser />

          <ButtonNav />
        </>
      )}
    </div>
  );
};

export default MainUsers;
