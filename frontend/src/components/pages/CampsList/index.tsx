import {
  Container,
} from "@chakra-ui/react";
import React, { useState } from "react";
import CampsNavigationHeading from "./CampsNavigationHeading";
import CampsTable from "./CampsTable";

const CampsListPage = (): React.ReactElement => {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <Container
      maxWidth="100vw"
      minHeight="100vh"
      px="3em"
      py="3em"
      background="background.grey.200"
    >
      <CampsNavigationHeading
        year={year}
        onNavigateLeft={() => setYear(year - 1)}
        onNavigateRight={() => setYear(year + 1)}
      />
      <CampsTable year={year} />
    </Container>
  );
};

export default CampsListPage;
