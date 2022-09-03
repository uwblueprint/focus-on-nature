import React, { useState } from "react";
import CampsNavigationHeader from "./CampsNavigationHeader";

const CampsListPage = (): React.ReactElement => {
  const [year, setYear] = useState(2022);
  return (
    <>
      <CampsNavigationHeader
        year={year}
        onNavigateLeft={() => setYear(year - 1)}
        onNavigateRight={() => setYear(year + 1)}
      />
    </>
  );
};

export default CampsListPage;
