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
import { Camp, CampCoordinator, User } from "../../../types/CampsTypes";
import { UserResponse } from "../../../types/UserTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import SelectComponent from "./SelectComponent";

// dummy data for now
const users1 = [
  { value: "id1", label: "Michael Scott" },
  { value: "id2", label: "Dwight Shrute" },
];

const users2 = [
  { value: "id1", label: "Michael Scott2" },
  { value: "id2", label: "Dwight Shrute2" },
];

export type CampOverviewProps = {
  campId: string;
};

const CampOverview = (): JSX.Element => {
  const [users, setUsers] = React.useState([] as UserResponse[]);
  const [camp, setCamp] = useState<Camp>();
  const campId = "62c098e7b4a7a433a7622ff4"; // hardcoded for now, TODO: update this
  let campCoordinators: User[] = [];

  // TODO: update the statuses
  enum Status {
    PUBLISHED = "Published",
    DRAFT = "Draft",
  }

  const status = camp?.active ? Status.PUBLISHED : Status.DRAFT;

  const formatUsers = (): User[] => {
    const formattedUsers = users.map((user) => {
      return {
        value: user.id,
        label: `${user.firstName} + " " + ${user.lastName}`,
      };
    });
    console.log("formatted users");
    console.log(formattedUsers);
    return formattedUsers;
  };

  useEffect(() => {
    const getCampInfo = async () => {
      const campResponse = await CampsAPIClient.getCampById(campId);
      setCamp(campResponse);
    };
    getCampInfo();

    const getUsers = async () => {
      const userResponse = await UserAPIClient.getUsers();
      setUsers(userResponse);
    };
    getUsers();
    console.log("users");
    console.log(users);
    campCoordinators = formatUsers();

    console.log("campCoordinators");
    console.log(campCoordinators); // ISSUE: the async thing with fetching users but then this doesn't display in the select component
  }, []);

  // somehow get the type for each...and do a conditional calling to update
  // ISSUE: the patch doesn't work when updating it as an array of strings...
  const editCampInfo = async (e: any, type: string) => {
    let campData: CampCoordinator[] = [];

    console.log("print e");
    console.log(e);
    campData = e.map((campPerson: { value: any }) => campPerson.value);
    // campData in camp session form???
    console.log("print campData");
    console.log(campData);

    const updatedCamp = await CampsAPIClient.editCampById(camp!.id, {
      campCoordinators: campData,
    });
    console.log(updatedCamp);
  };

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
              <VStack
                marginBottom="24px"
                alignItems="left"
                spacing="16px"
                width="30%"
              >
                <Text textStyle="bodyRegular">Camp Coordinators:</Text>
                <Text textStyle="bodyRegular">Camp Counsellors:</Text>
                <Text textStyle="bodyRegular">Volunteers:</Text>
              </VStack>
              <VStack marginBottom="24px" alignItems="left" width="100%">
                <SelectComponent
                  placeholderText="Add camp coordinator(s)"
                  users={campCoordinators}
                  onChange={editCampInfo}
                />
                <SelectComponent
                  placeholderText="Add camp counsellor(s)"
                  users={users2}
                  onChange={editCampInfo}
                />
                <SelectComponent
                  placeholderText="Add volunteer(s)"
                  users={users2}
                  onChange={editCampInfo}
                />
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
            marginLeft="24px"
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
