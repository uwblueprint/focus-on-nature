import { Flex, Box, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { CampResponse } from "../../../types/CampsTypes";
import CampsNavigationHeading from "./CampsNavigationHeading";
import CampsTable from "./CampsTable";
import PreviewCampDrawer from "./PreviewCampDrawer";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import DeleteModal from "../../common/DeleteModal";

const CampsListPage = (): React.ReactElement => {
  const [year, setYear] = useState(new Date().getFullYear());

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const [camps, setCamps] = React.useState([] as CampResponse[]);

  const [campDrawerInfo, setCampDrawerInfo] = useState<CampResponse>();
  const [campToDelete, setCampToDelete] = React.useState<CampResponse | null>(
    null,
  );

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const toast = useToast();

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getCamps = async () => {
      const res = await CampsAPIClient.getAllCamps(year);
      if (res) {
        setCamps(res);
      }
      setLoading(false);
    };

    getCamps();
  }, [year]);

  const handleConfirmDelete = async () => {
    if (!campToDelete) {
      return;
    }

    const res = await CampsAPIClient.deleteCamp(campToDelete.id);
    if (res) {
      toast({
        description: `${campToDelete.name} has been succesfully deleted`,
        status: "success",
        variant: "subtle",
        duration: 3000,
      });

      const newCampsList: CampResponse[] = camps.filter((camp) => {
        return camp.id !== campToDelete.id;
      });
      setCamps(newCampsList);
    } else {
      toast({
        description: `An error occurred with deleting ${campToDelete.name}. Please try again.`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
    onDeleteModalClose();
    setCampToDelete(null);
  };

  const onDeleteClick = (camp: CampResponse) => {
    setCampToDelete(camp);
    onDeleteModalOpen();
  };

  return (
    <>
      <DeleteModal
        title="Delete Camp"
        bodyText={`Are you sure you want to delete ${campToDelete?.name}?`}
        bodyNote="Note: This action is irreversible."
        buttonLabel="Remove"
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onDelete={() => handleConfirmDelete()}
      />
      <Flex
        width={isDrawerOpen ? "calc(100% - 500px)" : "100%"}
        transition="width 0.5s"
        top="68px"
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
            onNavigateLeft={() => {
              setLoading(true);
              setYear(year - 1);
              onDrawerClose();
            }}
            onNavigateRight={() => {
              setLoading(true);
              setYear(year + 1);
              onDrawerClose();
            }}
          />
          <CampsTable
            camps={camps}
            isDrawerOpen={isDrawerOpen}
            onDrawerOpen={onDrawerOpen}
            campDrawerInfo={campDrawerInfo}
            setCampDrawerInfo={setCampDrawerInfo}
            onDeleteClick={onDeleteClick}
            loading={loading}
          />
        </Box>
        <PreviewCampDrawer
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          camp={campDrawerInfo}
          onDeleteClick={onDeleteClick}
        />
      </Flex>
    </>
  );
};

export default CampsListPage;
