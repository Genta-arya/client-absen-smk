import React from "react";
import Headers from "../../components/Headers";
import Tools from "../../components/Tools";
import Charts from "./components/Charts";
import MainPengumuman from "./MainPengumuman";
import MainPKL from "../../components/RoleView/Pembimbing/MainPKL";

const MainHome = ({ role, user }) => {
  return (
    <div>
      <>
        <Tools title={user?.role === "admin" ? "Dashboard" : ""} />
        {user?.role === "admin" && <Headers role={role} user={user} />}

        {user?.role === "pembimbing" && (
          <div className="mt-12">
            <MainPKL />
          </div>
        )}

        <MainPengumuman />

        {/* <Charts /> */}
      </>
    </div>
  );
};

export default MainHome;
