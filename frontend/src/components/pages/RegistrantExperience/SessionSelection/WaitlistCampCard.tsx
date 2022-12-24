import React, { useState } from "react";
import { Box, Text, Grid, GridItem, Center, Show } from "@chakra-ui/react";
import { CampSessionResponse } from "../../../../types/CampsTypes";

const WaitlistCampCard = ({
  fee,
  startTime,
  endTime,
  campData,
  handleClick,
  disabled,
}: {
  fee: number;
  startTime: string;
  endTime: string;
  campData: CampSessionResponse;
  handleClick: (sessionID: string, sessionType: string) => void;
  disabled: boolean;
}): React.ReactElement => {
  const [backgroundColour, setbackgroundColour] = useState("white");

  const handleCardClick = () => {
    if (!disabled) {
      if (backgroundColour === "red.100") {
        setbackgroundColour("white");
      } else {
        setbackgroundColour("red.100");
      }
      handleClick(campData.id, "Waitlist");
    }
  };

  const getCampSessionDate = () => {
    const startDate = new Date(campData.dates[0]);
    const endDate = new Date(campData.dates[campData.dates.length - 1]);
    return `${startDate.toLocaleString("default", {
      month: "short",
    })} ${startDate.getDay()} - ${endDate.toLocaleString("default", {
      month: "short",
    })} ${endDate.getDay()}, ${endDate.getFullYear()}`;
  };

  return (
    <Box
      bg={backgroundColour}
      width={{ sm: 40, md: 48, lg: 48 }}
      height={{ sm: 36, md: 28, lg: 28 }}
      my={2}
      px={1}
      py={3}
      borderColor="red"
      borderWidth="1px"
      borderRadius="md"
      onClick={() => {
        handleCardClick();
      }}
      _hover={{
        background:
          backgroundColour === "red.100" ? "red.100" : "RGBA(0, 0, 0, 0.16)",
      }}
      cursor={disabled ? "not-allowed" : "pointer"}
      opacity={disabled ? "0.5" : "1"}
    >
      <Grid templateColumns="repeat(1, 1fr)">
        <GridItem>
          <Text fontSize="sm" color="red">
            Session Full
          </Text>
        </GridItem>
        <GridItem mb={{ sm: 1, md: 2, lg: 2 }}>
          <Show breakpoint="(min-width: 768px)">
            <Center>
              <Text color="black" fontSize="md">
                {getCampSessionDate()}
              </Text>
            </Center>
          </Show>
          <Show breakpoint="(max-width: 767px)">
            <Text color="black" fontSize="md">
              {getCampSessionDate()}
            </Text>
          </Show>
        </GridItem>
        <Show breakpoint="(min-width: 768px)">
          <GridItem>
            <Center>
              <Text fontSize="xs" color="black">
                {startTime}AM - {endTime}PM · ${fee}
              </Text>
            </Center>
          </GridItem>
        </Show>
        <Show breakpoint="(max-width: 767px)">
          <GridItem mb={1}>
            <Text fontSize="xs" color="black">
              {startTime}AM - {endTime}PM
            </Text>
          </GridItem>
        </Show>
        <Show breakpoint="(max-width: 767px)">
          <GridItem>
            <Text fontSize="xs" color="black">
              ${fee}
            </Text>
          </GridItem>
        </Show>
      </Grid>
    </Box>
  );
};

export default WaitlistCampCard;
