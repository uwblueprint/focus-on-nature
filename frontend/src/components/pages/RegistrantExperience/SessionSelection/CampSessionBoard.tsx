import React from "react";
import { Box, Text, Grid, GridItem } from "@chakra-ui/react";
import { CampResponse, CampSessionResponse } from "../../../../types/CampsTypes";
import AvailableCampCard from "./AvailableCampCard";
import WaitlistCampCard from "./WaitlistCampCard";

const CampSessionBoard = ({
  camp,
  sesssionTypeDisabled,
  handleSessionClick,
}: {
  camp: CampResponse,
  sesssionTypeDisabled: string,
  handleSessionClick: (sessionID:string, sessionType:string) => void,
}): React.ReactElement => {

  return (
    <Box>
    <Text fontSize={{ sm: 'xl', md: 'xl', lg:'3xl' }} as='b' mt={4} mb={4}>Available Camps</Text>
      <Grid templateColumns={{ sm: 'repeat(2, 1fr)', md:'repeat(3, 1fr)', lg:'repeat(3, 1fr)' }} mb={10}>
        {camp.campSessions.map((value) => {
          if (value.campers.length !== value.capacity) {
            return (
              <GridItem key={value.id}>
                  <AvailableCampCard fee={camp.fee} startTime={camp.startTime} endTime={camp.endTime} campData={value as CampSessionResponse} handleClick={handleSessionClick} disabled={sesssionTypeDisabled === 'available'}/>
              </GridItem>
            )
          }
          return <></>
        })}
      </Grid>
      <Text fontSize={{ sm: 'xl', md: 'xl', lg:'3xl' }} as='b' mt={4} mb={4}>Waitlist Only Camps</Text>
      <Grid templateColumns={{ sm: 'repeat(2, 1fr)', md:'repeat(3, 1fr)', lg:'repeat(3, 1fr)' }} mb={4}>
        {camp.campSessions.map((value) => {
          if (value.campers.length === value.capacity) {
            return (
              <GridItem key={value.id}>
                <WaitlistCampCard fee={camp.fee} startTime={camp.startTime} endTime={camp.endTime} campData={value as CampSessionResponse} handleClick={handleSessionClick} disabled={sesssionTypeDisabled === 'waitlist'}/>
              </GridItem>
            )
          }
          return <></>
        })}
      </Grid>
    </Box>
  )
};

export default CampSessionBoard;
