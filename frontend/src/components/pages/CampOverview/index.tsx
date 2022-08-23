import {
  AspectRatio,
  Box,
  Container,
  Flex,
  HStack,
  Image,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import placeHolderImage from "../../../assets/germany.jpeg";
import costIcon from "../../../assets/coin.svg";
import locationIcon from "../../../assets/location.svg";
import ageIcon from "../../../assets/person.svg";
import { CampResponse } from "../../../types/CampsTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";

export type CampOverviewProps = {
  campId: string;
};

const CampOverview = (): JSX.Element => {
  const [camp, setCamp] = useState<CampResponse>();
  const campId = "62c098e7b4a7a433a7622ff4"; // hardcoded for now, TODO: update this

  // TODO: update the statuses
  enum CampStatus {
    PUBLISHED = "Published",
    DRAFT = "Draft",
  }

  const status = camp?.active ? CampStatus.PUBLISHED : CampStatus.DRAFT;

  useEffect(() => {
    const getCampInfo = async () => {
      const campResponse = await CampsAPIClient.getCampById(campId);
      if (campResponse) setCamp(campResponse);
    };
    getCampInfo();
  }, []);

  return (
    <>
      <Container maxWidth="100vw">
        <Flex marginLeft="80px" marginRight="80px">
          <Box width="100%" mt="1rem">
            <HStack width="100%" marginBottom="8px" alignItems="center">
              <Text align="left" textStyle="displayXLarge" marginBottom="8px">
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
            </HStack>
            <HStack spacing="20px" alignItems="middle">
              <VStack marginBottom="24px" alignItems="left" spacing="16px">
                <Text textStyle="bodyRegular">Camp Coordinators:</Text>
                <Text textStyle="bodyRegular">Camp Counsellors:</Text>
                <Text textStyle="bodyRegular">Volunteers:</Text>
              </VStack>
              <VStack marginBottom="24px" alignItems="left" spacing="16px">
                <Text textStyle="bodyRegular">Placeholder</Text>
                <Text textStyle="bodyRegular">Placeholder</Text>
                <Text textStyle="bodyRegular">Placeholder</Text>
              </VStack>
            </HStack>
            <Text marginBottom="12px" textStyle="bodyBold" width="100%">
              Camp Details
            </Text>
            <Text marginBottom="16px" textStyle="bodyRegular" width="100%">
              {camp?.description}
            </Text>
            <HStack spacing="24px" alignItems="center">
              <HStack>
                <Image
                  objectFit="scale-down"
                  src={costIcon}
                  alt="Cost Icon"
                  width="32px"
                  height="32px"
                />
                <Text textStyle="bodyRegular">${camp?.fee} per day</Text>
              </HStack>
              <HStack>
                <Image
                  objectFit="scale-down"
                  src={ageIcon}
                  alt="Capacity Range Icon"
                  width="32px"
                  height="32px"
                />
                <Text textStyle="bodyRegular">
                  {camp?.ageLower} to {camp?.ageUpper} years old
                </Text>
              </HStack>
              <HStack>
                <Image
                  objectFit="scale-down"
                  src={locationIcon}
                  alt="Location Icon"
                  width="32px"
                  height="32px"
                />
                <Text textStyle="bodyRegular">{camp?.location}</Text>
              </HStack>
            </HStack>
          </Box>
          <AspectRatio
            marginTop="32px"
            marginLeft="20px"
            width="80%"
            maxHeight="400px"
            ratio={16 / 9}
          >
            <Image
              objectFit="scale-down"
              src={placeHolderImage}
              alt="Camp Image"
            />
          </AspectRatio>
        </Flex>
      </Container>
    </>
  );
};

export default CampOverview;
