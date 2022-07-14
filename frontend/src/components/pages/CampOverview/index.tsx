import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  Image,
  Stack,
  Tag,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import placeHolderImage from "../../../assets/germany.jpeg";
import costIcon from "../../../assets/coin.svg";
import locationIcon from "../../../assets/location.svg";
import ageIcon from "../../../assets/person.svg";
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

  enum Status {
    PUBLISHED = "Published",
    DRAFT = "Draft",
  }

  const statusOptions = [Status.PUBLISHED, Status.DRAFT];

  const status = camp?.active ? Status.PUBLISHED : Status.DRAFT;

  useEffect(() => {
    const getCampInfo = async () => {
      const campResponse = await CampsAPIClient.getCampById(campId);
      setCamp(campResponse);
    };
    getCampInfo();
  }, []);

  return (
    <>
      <Container maxWidth="100vw">
        <Flex marginLeft="80px" marginRight="80px">
          <Box width="100%" mt="1rem">
            <Stack direction="row" width="100%">
              <Text align="left" marginBottom="8px" textStyle="displayXLarge">
                {camp?.name}
              </Text>
              <HStack>
              <Tag
                key={status}
                size="md"
                borderRadius="full"
                colorScheme={camp?.active ? "green" : "gray"}
              >
                {status}
              </Tag>
              </HStack>
            </Stack>
            <HStack alignItems="middle">
            <VStack marginBottom="24px" alignItems="left">
            <Text marginBottom="8px" textStyle="bodyRegular">
                Camp Coordinators:
              </Text>
              <Text marginBottom="8px" textStyle="bodyRegular">
                Camp Counsellors:
              </Text>
              <Text marginBottom="24px" textStyle="bodyRegular" width="100%">
                Volunteers:
              </Text>
            </VStack>
            <VStack marginBottom="24px" alignItems="left">
            <Text marginBottom="8px" textStyle="bodyRegular">
                Placeholder
              </Text>
              <Text marginBottom="8px" textStyle="bodyRegular">
                Placeholder
              </Text>
              <Text marginBottom="24px" textStyle="bodyRegular">
                Placeholder
              </Text>
            </VStack>
            </HStack>
            {/* <HStack spacing="20px" alignItems="middle">
              <Text marginBottom="8px" textStyle="bodyRegular">
                Camp Coordinators:
              </Text>
              <Text marginBottom="8px" textStyle="bodyRegular">
                Placeholder
              </Text>
            </HStack>
            <HStack spacing="20px" alignItems="middle">
              <Text marginBottom="8px" textStyle="bodyRegular">
                Camp Counsellors:
              </Text>
              <Text marginBottom="8px" textStyle="bodyRegular">
                Placeholder
              </Text>
            </HStack>
            <HStack spacing="20px" alignItems="middle">
              <Text marginBottom="24px" textStyle="bodyRegular">
                Volunteers:
              </Text>
              <Text marginBottom="24px" textStyle="bodyRegular">
                Placeholder
              </Text>
            </HStack> */}
            <Text marginBottom="12px" textStyle="bodyBold" width="100%">
              Camp Details
            </Text>
            <Text marginBottom="16px" textStyle="bodyRegular" width="100%">
              {camp?.description}
            </Text>
            <Stack direction="row" alignItems="center">
              <Image 
                objectFit="scale-down"
                src={costIcon} 
                alt="Cost Icon"
                width="32px"
                height="32px"
              />
              <Text textStyle="bodyRegular" width="100%">
                ${camp?.fee} per day
              </Text>
              <Image
                marginLeft="24px"
                objectFit="scale-down"
                src={ageIcon}
                alt="Capacity Range Icon"
                width="32px"
                height="32px"
              />
              <Text textStyle="bodyRegular" width="100%">
                {camp?.ageLower} to {camp?.ageUpper}
              </Text>
              <Image
                objectFit="scale-down"
                src={locationIcon}
                alt="Location Icon"
                width="32px"
                height="32px"
              />
              <Text textStyle="bodyRegular" width="100%">
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
