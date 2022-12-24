import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Image,
  Grid,
  Text,
  GridItem,
  Show,
  Flex,
  AspectRatio,
} from "@chakra-ui/react";
import { CampResponse } from "../../../../types/CampsTypes";
import CampDetails from "./CampDetails";
import CampSessionBoard from "./CampSessionBoard";

type SesssionSelectionProps = {
  camp: CampResponse;
  setSelectedSessionsIds: (newSelections: string[]) => void;
};

const SessionSelection = ({
  camp,
  setSelectedSessionsIds,
}: SesssionSelectionProps): React.ReactElement => {
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedSessionType, setSelectedSessionType] = useState({
    available: 0,
    waitlist: 0,
  });
  const [sesssionTypeDisabled, setSesssionTypeDisabled] = useState("none");

  const setSessionTypeDisabled = () => {
    if (selectedSessionType.available !== 0) {
      setSesssionTypeDisabled("waitlist");
    } else if (selectedSessionType.waitlist !== 0) {
      setSesssionTypeDisabled("available");
    } else {
      setSesssionTypeDisabled("none");
    }
  };

  const addSelectedSession = (sessionID: string, sessionType: string) => {
    setSelectedSessions([...selectedSessions, sessionID]);
    if (sessionType === "Available") {
      setSelectedSessionType({
        ...selectedSessionType,
        available: selectedSessionType.available + 1,
      });
    } else {
      setSelectedSessionType({
        ...selectedSessionType,
        waitlist: selectedSessionType.waitlist + 1,
      });
    }
  };

  const removeSelectedSession = (sessionID: string, sessionType: string) => {
    setSelectedSessions((prev) =>
      prev.filter((campSession) => campSession !== sessionID),
    );
    if (sessionType === "Available") {
      setSelectedSessionType({
        ...selectedSessionType,
        available: selectedSessionType.available - 1,
      });
    } else {
      setSelectedSessionType({
        ...selectedSessionType,
        waitlist: selectedSessionType.waitlist - 1,
      });
    }
  };

  const handleSessionClick = (sessionID: string, sessionType: string) => {
    if (selectedSessions.includes(sessionID)) {
      removeSelectedSession(sessionID, sessionType);
    } else {
      addSelectedSession(sessionID, sessionType);
    }
  };

  useEffect(() => {
    setSessionTypeDisabled();
  }, [selectedSessionType]);

  const handleFormSubmission = () => {
    setSelectedSessionsIds(selectedSessions);
  };

  return (
    <Box>
      <Grid templateColumns="repeat(2, 1fr)">
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Box>
            <Grid templateColumns="repeat(2, 1fr)" gap={2} m={5}>
              <GridItem colSpan={{ sm: 2, md: 1, lg: 2 }}>
                {camp.campPhotoUrl && (
                  <Box width="40%">
                    <AspectRatio marginLeft="24px" ratio={16 / 9}>
                      <Image
                        objectFit="scale-down"
                        src={camp.campPhotoUrl}
                        alt="Camp Image"
                      />
                    </AspectRatio>
                  </Box>
                )}
                <Box mt={{ sm: 4, md: 4, lg: 2 }}>
                  <img src="https://bit.ly/2jYM25F" alt="Italian Trulli" />
                </Box>
              </GridItem>
              <GridItem colSpan={{ sm: 2, md: 1, lg: 2 }}>
                <CampDetails
                  name={camp.name}
                  ageLower={camp.ageLower}
                  ageUpper={camp.ageUpper}
                  earlyDropoff={camp.earlyDropoff}
                  latePickup={camp.latePickup}
                  location={`${camp.location.streetAddress1}, ${camp.location.city}, ${camp.location.province} ${camp.location.postalCode}`}
                />
              </GridItem>
              <GridItem colSpan={2}>
                <Show above="md">
                  <Text as="b">Camp Details</Text>
                  <Text>{camp.description}</Text>
                </Show>
              </GridItem>
            </Grid>
          </Box>
        </GridItem>
        <GridItem
          colSpan={{ sm: 2, md: 2, lg: 1 }}
          pl={{ sm: 4, md: 4, lg: 12 }}
          pt={{ lg: 14 }}
          bg={{ sm: "", md: "", lg: "RGBA(0, 0, 0, 0.04)" }}
        >
          <CampSessionBoard
            camp={camp}
            sesssionTypeDisabled={sesssionTypeDisabled}
            handleSessionClick={handleSessionClick}
          />
        </GridItem>
      </Grid>
      <Flex align="right" justify="right" width="100%" mt={10} mb={4}>
        {sesssionTypeDisabled === "waitlist" && (
          <Button
            mr={10}
            px={16}
            colorScheme="green"
            onClick={() => handleFormSubmission()}
          >
            Sign up now
          </Button>
        )}
        {sesssionTypeDisabled === "available" && (
          <Button
            mr={10}
            px={16}
            colorScheme="green"
            variant="outline"
            onClick={() => handleFormSubmission()}
          >
            Register for waitlist
          </Button>
        )}
        {sesssionTypeDisabled === "none" && (
          <Button mr={10} px={16} colorScheme="green" disabled>
            Sign up now
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default SessionSelection;
