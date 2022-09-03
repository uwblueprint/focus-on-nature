import React, { useState } from "react";
import CampsNavigationHeading from "./CampsNavigationHeading";

const CampsListPage = (): React.ReactElement => {
  const [year, setYear] = useState(2022);
  return (
    <>
      <CampsNavigationHeading
        year={year}
        onNavigateLeft={() => setYear(year - 1)}
        onNavigateRight={() => setYear(year + 1)}
      />
    </>
  );
};

export default CampsListPage;
