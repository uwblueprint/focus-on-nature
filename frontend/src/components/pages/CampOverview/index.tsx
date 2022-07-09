import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Image,
  Stack,
  Tag,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import placeHolderImage from "../../../assets/germany.jpeg";
import costIcon from "../../../assets/cost.png";
import locationIcon from "../../../assets/location.png";
import capacityRangeIcon from "../../../assets/capacityrange.png";
import numberPerSessionIcon from "../../../assets/numberpersesh.png";
import { Camp } from "../../../types/CampsTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";

import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";

export type CampOverviewProps = {
  campId: string;
};

const CampOverview = (): JSX.Element => {
  const [camp, setCamp] = useState<Camp>();
  const campId = "62c098e7b4a7a433a7622ff4"; // hardcoded for now

  useEffect(() => {
    const getCampInfo = async () => {
      const campResponse = await CampsAPIClient.getCampById(campId);
      setCamp(campResponse);
      console.log(campResponse);
    };
    getCampInfo();
  }, []);

  return (
    <>
      <Container maxWidth="100vw">
        <Flex marginLeft="80px" marginRight="80px">
          <Box width="100%" mt="1rem">
            <Stack direction="row" width="100%">
              <Text align="left" marginBottom="13px" textStyle="displayXLarge">
                {camp?.name}
              </Text>
              <Tag
                size="md"
                borderRadius="full"
                variant="solid"
                colorScheme="orange"
                width="6em"
                px="1.5em"
              />
            </Stack>
            <Stack direction="row" width="100%">
              <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
                Camp Coordinators:
              </Text>
              <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
                Placeholder
              </Text>
            </Stack>
            <Stack direction="row" width="100%">
              <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
                Camp Counsellors:
              </Text>
              <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
                Placeholder
              </Text>
            </Stack>
            <Stack direction="row" width="100%">
              <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
                Volunteers:
              </Text>
              <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
                Placeholder
              </Text>
            </Stack>
            <Text marginBottom="30px" textStyle="bodyBold" width="100%">
              Camp Details
            </Text>
            <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
              {camp?.description}
            </Text>
            <Stack direction="row" width="100%">
              <Image objectFit="scale-down" src={costIcon} alt="Cost Icon" />
              <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
                ${camp?.fee} per day
              </Text>
              <Image
                objectFit="scale-down"
                src={capacityRangeIcon}
                alt="Capacity Range Icon"
              />
              <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
                {camp?.ageLower} to {camp?.ageUpper}
              </Text>
              <Image
                objectFit="scale-down"
                src={numberPerSessionIcon}
                alt="Number Per Session Icon"
              />
              <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
                # campers per session
              </Text>
              <Image
                objectFit="scale-down"
                src={locationIcon}
                alt="Location Icon"
              />
              <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
                {camp?.location}
              </Text>
            </Stack>
          </Box>

          <Image
            objectFit="scale-down"
            height="260px"
            ml="5rem"
            alignSelf="flex-end"
            src={placeHolderImage}
            alt="Camp Image"
          />
        </Flex>
      </Container>
    </>
  );
};

export default CampOverview;
