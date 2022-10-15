import { Box, Text, useToast } from "@chakra-ui/react";
import React from "react";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import { UpdateWaiverRequest, WaiverClause } from "../../../types/AdminTypes";
import Footer from "./Footer";

const GlobalFormsPage = (): React.ReactElement => {
  const waiver: UpdateWaiverRequest = {
    clauses: [
      { text: "thing 1", required: true },
      { text: "thing 2", required: true },
      { text: "thing 3", required: true },
    ],
  };

  const toast = useToast();

  const updateWaiver = async (newClause: WaiverClause) => {
    waiver.clauses.push(newClause);
    const updatedWaiver: UpdateWaiverRequest = await AdminAPIClient.onAddWaiverSectionClick(
      waiver,
    );
    if (updatedWaiver.clauses) {
      const newSectionCharCode: number = updatedWaiver.clauses.length + 64;
      const newSectionChar: string = String.fromCharCode(newSectionCharCode);
      toast({
        description: `Section ${newSectionChar} has been added to the waiver form`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });
    } else {
      toast({
        description: `Section could not be added, please try again later`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <Text>Global Forms Page</Text>
      <Footer isWaiverFooter updateWaiver={updateWaiver} />
    </Box>
  );
};

export default GlobalFormsPage;
