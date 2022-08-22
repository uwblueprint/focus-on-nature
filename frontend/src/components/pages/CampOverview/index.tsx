import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import placeHolderImage from "../../../assets/germany.jpeg";
import costIcon from "../../../assets/coin.svg";
import locationIcon from "../../../assets/location.svg";
import ageIcon from "../../../assets/person.svg";
import { Camp, CampCoordinator, UserOption } from "../../../types/CampsTypes";
import { UserResponse } from "../../../types/UserTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import SelectComponent from "./SelectComponent";

// TODO: update the statuses
enum Status {
  PUBLISHED = "Published",
  DRAFT = "Draft",
}

export type CampOverviewProps = {
  campId: string;
};

const CampOverview = (): JSX.Element => {
  const [users, setUsers] = React.useState([] as UserResponse[]);
  const [camp, setCamp] = useState<Camp>();
  const campId = "62c098e7b4a7a433a7622ff4"; // hardcoded for now, TODO: update this

  useEffect(() => {
    const getCampInfo = async () => {
      const campResponse = await CampsAPIClient.getCampById(campId);
      setCamp(campResponse);
    };
    getCampInfo();

    const getUsers = async () => {
      let userResponse = await UserAPIClient.getAllUsers();
      if (userResponse) {
        userResponse = userResponse.filter((user) => {
          return user.role === "CampCoordinator";
        });
        setUsers(userResponse);
      }
    };
    getUsers();
  }, []);

  const status = camp?.active ? Status.PUBLISHED : Status.DRAFT;

  const formatUsers = (): UserOption[] => {
    const formattedUsers = users.map((user) => {
      return {
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      };
    });
    return formattedUsers;
  };

  // TODO: need to update this function after the camp API changes
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

  // getting the string inputted into the volunteer field
  const [volunteers, setVolunteers] = React.useState("");
  const editVolunteers = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setVolunteers(event.target.value);
  console.log("volunteers");
  console.log(volunteers);

  console.log("camp fields");
  console.log(camp);

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

            <Grid
              templateColumns="repeat(4, 1fr)"
              gap={2}
              alignItems="center"
              marginBottom="24px"
            >
              <GridItem>
                <Text textStyle="bodyRegular">Camp Coordinators:</Text>
              </GridItem>
              <GridItem colSpan={3}>
                <SelectComponent
                  placeholderText="Add camp coordinator(s)"
                  users={formatUsers()}
                  onChange={editCampInfo}
                />
              </GridItem>
              <GridItem>
                <Text textStyle="bodyRegular">Camp Counsellors:</Text>
              </GridItem>
              <GridItem colSpan={3}>
                <SelectComponent
                  placeholderText="Add camp counsellor(s)"
                  users={formatUsers()}
                  onChange={editCampInfo}
                />
              </GridItem>
              <GridItem>
                <Text textStyle="bodyRegular">Volunteers:</Text>
              </GridItem>
              <GridItem colSpan={3}>
                <Input
                  onChange={editVolunteers}
                  placeholder="Add volunteer(s)"
                  _placeholder={{ color: "text.grey.100" }}
                  size="md"
                  _focusVisible={{ outline: "0" }}
                />
              </GridItem>
            </Grid>

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
              src={placeHolderImage} // TODO: replace w/ image url
              alt="Camp Image"
            />
          </AspectRatio>
        </Flex>
      </Container>
    </>
  );
};

export default CampOverview;
