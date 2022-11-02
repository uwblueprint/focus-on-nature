import React, { useState } from "react";
import CampsNavigationHeading from "./CampsNavigationHeading";

const CampsListPage = (): React.ReactElement => {
  const [year, setYear] = useState(new Date().getFullYear());

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };
  return (
    <>
      <CampsNavigationHeading
        year={year}
        onNavigateLeft={() => setYear(year - 1)}
        onNavigateRight={() => setYear(year + 1)}
      />
<<<<<<< HEAD
=======
      <CampsTable year={year} />
>>>>>>> a1603f2 (Updated camps table)
    </>
  );
};

export default CampsListPage;
