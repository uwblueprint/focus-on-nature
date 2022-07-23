import React, { useContext } from "react";
import { CampersTableNavBar } from "./camps/CampersTableNavBar";

const CampsPage = (): React.ReactElement => {
  return (
    <div>
      <h2>Camps Page</h2>
      <CampersTableNavBar />
    </div>
  );
};

export default CampsPage;
