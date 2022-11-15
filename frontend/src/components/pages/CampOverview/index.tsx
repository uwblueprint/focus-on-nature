import {
  Box,
  Container,
  Divider,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  CampResponse,
  CampSessionResponse,
  UpdateCampSessionsRequest,
} from "../../../types/CampsTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import CampSessionInfoHeader from "../../common/camps/CampSessionInfoHeader";
import CampDetails from "./CampDetails";
import Footer from "./Footer";
import EmptyCampSessionState from "./CampersTable/EmptyCampSessionState";
import CampersTables from "./CampersTable/CampersTables";
import * as Routes from "../../../constants/Routes";
import ManageSessionsModal from "./ManageSessions/ManageSessionsModal";

type ManageSessionsPromisesResult = {
  deletedSessions?: boolean;
  updatedSessions?: Array<CampSessionResponse>;
};

const CampOverviewPage = (): JSX.Element => {
  const { id: campId } = useParams<{ id: string }>();
  const [currentCampSession, setCurrentCampSession] = useState(0);
  const [camp, setCamp] = useState<CampResponse>({
    id: "",
    active: false,
    ageLower: 0,
    ageUpper: 0,
    campCoordinators: [],
    campCounsellors: [],
    name: "",
    description: "",
    earlyDropoff: "",
    endTime: "",
    latePickup: "",
    location: {
      streetAddress1: "",
      city: "",
      province: "",
      postalCode: "",
    },
    startTime: "",
    fee: 0,
    formQuestions: [],
    campSessions: [],
    volunteers: "",
    campPhotoUrl: "",
  });
  const numSessions = camp.campSessions?.length;

  const {
    isOpen: isOpenManageSessionsModal,
    onOpen: onOpenManageSessionsModal,
    onClose: onCloseManageSessionsModal,
  } = useDisclosure();
  const toast = useToast();

  const [refetch, setRefetch] = useState<boolean>(true);
  const handleRefetch = () => {
    setRefetch(!refetch);
  };

  useEffect(() => {
    const getCamp = async () => {
      const campResponse = await CampsAPIClient.getCampById(campId);
      if (campResponse) {
        setCamp(campResponse);
      }
    };

    getCamp();
  }, [campId, refetch]);

  const onNextSession = () => {
    if (numSessions >= 2)
      setCurrentCampSession(
        currentCampSession === numSessions - 1 ? 0 : currentCampSession + 1,
      );
  };

  const onPrevSession = () => {
    if (numSessions >= 2)
      setCurrentCampSession(
        currentCampSession === 0 ? numSessions - 1 : currentCampSession - 1,
      );
  };

  const getUpdateCampSessionsRequestArray = (
    updatedCapacities: Map<string, string>,
  ): Array<UpdateCampSessionsRequest> => {
    const requests: Array<UpdateCampSessionsRequest> = [];

    updatedCapacities.forEach((capacity, id) => {
      const updatedCapacityExists = capacity.trim().length > 0;
      if (updatedCapacityExists) {
        requests.push({ id, capacity: parseInt(capacity, 10) });
      }
    });

    return requests;
  };

  const getManageSessionsResult = async (
    deletedSessions: Set<string>,
    updatedCapacities: Map<string, string>,
  ): Promise<ManageSessionsPromisesResult> => {
    let sessionPromises: ManageSessionsPromisesResult = {};

    const deleteSessionsPromise =
      deletedSessions.size > 0
        ? CampsAPIClient.deleteCampSessionsByIds(
            campId,
            Array.from(deletedSessions),
          )
        : null;
    const updateCapacitiesPromise =
      updatedCapacities.size > 0
        ? CampsAPIClient.updateCampSessions(
            campId,
            getUpdateCampSessionsRequestArray(updatedCapacities),
          )
        : null;

    if (deleteSessionsPromise && updateCapacitiesPromise) {
      sessionPromises = await Promise.all([
        deleteSessionsPromise,
        updateCapacitiesPromise,
      ]).then((data) => {
        return {
          deletedSessions: data[0],
          updatedSessions: data[1],
        };
      });
    } else if (deleteSessionsPromise) {
      sessionPromises.deletedSessions = await deleteSessionsPromise;
    } else if (updateCapacitiesPromise) {
      sessionPromises.updatedSessions = await updateCapacitiesPromise;
    }

    return sessionPromises;
  };

  const onManageSessionsSave = async (
    deletedSessions: Set<string>,
    updatedCapacities: Map<string, string>,
  ) => {
    const manageSessionsResult = await getManageSessionsResult(
      deletedSessions,
      updatedCapacities,
    );
    const requestFailed =
      (manageSessionsResult.deletedSessions !== undefined &&
        !manageSessionsResult.deletedSessions) ||
      (manageSessionsResult.updatedSessions !== undefined &&
        manageSessionsResult.updatedSessions.length !== updatedCapacities.size);

    if (!requestFailed) {
      setTimeout(() => {
        handleRefetch();
        setCurrentCampSession(0);
      }, 500);

      toast({
        description: `Edits to camp sessions saved successfully.`,
        status: "success",
        duration: 3000,
      });
    } else {
      toast({
        description: `An error occurred while saving edits to camp sessions. Please try again.`,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Container
      maxWidth="100vw"
      minHeight="100vh"
      background="background.grey.200"
      paddingTop="5px"
    >
      <Box marginTop="1rem" marginX="40px">
        <Text marginBottom="15px" textStyle="informative">
          <Link to={Routes.CAMPS_PAGE}>
            <ChevronLeftIcon />
            Back to camp list
          </Link>
        </Text>
        <CampDetails camp={camp} setCamp={setCamp} />
        <Divider borderColor="background.grey.400" marginY="32px" />
        {camp.campSessions?.length > 0 ? (
          <>
            <CampSessionInfoHeader
              camp={camp}
              currentCampSession={currentCampSession}
              onNextSession={onNextSession}
              onPrevSession={onPrevSession}
              onClickManageSessions={onOpenManageSessionsModal}
            />
            <CampersTables
              campSession={camp.campSessions[currentCampSession]}
              formQuestions={camp.formQuestions}
              handleRefetch={handleRefetch}
            />
            <ManageSessionsModal
              campStartTime={camp.startTime}
              campEndTime={camp.endTime}
              sessions={camp.campSessions
                .sort(
                  (sessionA, sessionB) =>
                    new Date(sessionA.dates[0]).getUTCMilliseconds() -
                    new Date(sessionB.dates[0]).getUTCMilliseconds(),
                )
                .map((session) => {
                  return {
                    id: session.id,
                    capacity: session.capacity,
                    dates: session.dates,
                    registeredCampers: session.campers.length,
                  };
                })}
              onSaveChanges={onManageSessionsSave}
              isOpen={isOpenManageSessionsModal}
              onClose={onCloseManageSessionsModal}
            />
          </>
        ) : (
          <EmptyCampSessionState />
        )}
      </Box>
      <Footer camp={camp} />
    </Container>
  );
};

export default CampOverviewPage;
