import { Flex, Box, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { CampResponse } from "../../../types/CampsTypes";
import CampsNavigationHeading from "./CampsNavigationHeading";
import CampsTable from "./CampsTable";
import PreviewCampDrawer from "./PreviewCampDrawer";

const CampsListPage = (): React.ReactElement => {
  const [year, setYear] = useState(new Date().getFullYear());
  const {isOpen:isDrawerOpen, onOpen:onDrawerOpen, onClose:onDrawerClose} = useDisclosure()
  const [campDrawerInfo, setCampDrawerInfo] = useState<CampResponse>()

  return (
    <Flex 
      width={isDrawerOpen?"calc(100% - 500px)":"100%"}
      transition="width 0.5s"
      top = "68px"
    >
      <Box
        minHeight="100vh"
        px="3em"
        py="3em"
        background="background.grey.200"
        flex="1"
      >
        <CampsNavigationHeading
          year={year}
          onNavigateLeft={() => {setYear(year - 1); onDrawerClose()}}
          onNavigateRight={() => {setYear(year + 1); onDrawerClose()}}
        />
        <CampsTable 
          year={year}
          isDrawerOpen={isDrawerOpen} 
          onDrawerOpen={onDrawerOpen}
          campDrawerInfo={campDrawerInfo}
          setCampDrawerInfo={setCampDrawerInfo}
        />
      </Box>
      <PreviewCampDrawer isOpen={isDrawerOpen} onClose={onDrawerClose} camp={campDrawerInfo}/>
    </Flex>
  );
};

export default CampsListPage;
