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
} from "@chakra-ui/react";
import { MultiValue } from "chakra-react-select";
import React, { useEffect, useState } from "react";
import costIcon from "../../../assets/coin.svg";
import locationIcon from "../../../assets/location.svg";
import ageIcon from "../../../assets/person.svg";
import { Camp } from "../../../types/CampsTypes";
import { UserResponse } from "../../../types/UserTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import UserSelect from "./UserSelect";
import locationToString from "../../../utils/CampUtils";

// TODO: update the statuses
enum Status {
  PUBLISHED = "Published",
  DRAFT = "Draft",
}

const updateCamp = async (newCamp: Camp) => {
  if (newCamp.id) {
    await CampsAPIClient.editCampById(newCamp.id, newCamp);
  }
};

const CampOverview = (): JSX.Element => {
  const [users, setUsers] = React.useState([] as UserResponse[]);
  const [camp, setCamp] = useState<Camp>();
  const status = camp?.active ? Status.PUBLISHED : Status.DRAFT;
  const campId = "630a63450eb59852f9d01b1e"; // with camp photo
  // const campId = "62574d7ae89788006c93cf02"; // without camp photo

  useEffect(() => {
    const getCamp = async () => {
      const campResponse = await CampsAPIClient.getCampById(campId);
      setCamp(campResponse);
    };
    getCamp();

    const getUsers = async () => {
      const userResponse = await UserAPIClient.getAllUsers();
      if (userResponse) {
        const coordinators = userResponse.filter((user) => {
          return user.role === "CampCoordinator";
        });
        setUsers(coordinators);
      }
    };
    getUsers();
  }, []);

  const handleCoordinatorChange = (newValue: MultiValue<UserResponse>) => {
    const campCoordinators = newValue.map((user) => user.id);
    const newCamp = { ...camp, campCoordinators };
    setCamp(newCamp);
    updateCamp(newCamp);
  };

  const handleCounsellorChange = (newValue: MultiValue<UserResponse>) => {
    const campCounsellors = newValue.map((user) => user.id);
    const newCamp = { ...camp, campCounsellors };
    setCamp(newCamp);
    updateCamp(newCamp);
  };

  const handleVolunteerChange = (e: any) => {};

  return (
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
              <UserSelect
                placeholderText="Add camp coordinator(s)"
                users={users}
                onChange={handleCoordinatorChange}
              />
            </GridItem>
            <GridItem>
              <Text textStyle="bodyRegular">Camp Counsellors:</Text>
            </GridItem>
            <GridItem colSpan={3}>
              <UserSelect
                placeholderText="Add camp counsellor(s)"
                users={users}
                onChange={handleCounsellorChange}
              />
            </GridItem>
            <GridItem>
              <Text textStyle="bodyRegular">Volunteers:</Text>
            </GridItem>
            <GridItem colSpan={3}>
              <Input
                onChange={handleVolunteerChange}
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
              <Text textStyle="bodyRegular">
                {locationToString(camp?.location)}
              </Text>
            </HStack>
          </HStack>
        </Box>
        {camp?.campPhotoUrl && (
          <Box width="40%">
            <AspectRatio
              marginTop="32px"
              marginLeft="24px"
              width="80%"
              maxHeight="400px"
              ratio={16 / 9}
            >
              <Image
                objectFit="scale-down"
                src={camp?.campPhotoUrl}
                alt="Camp Image"
              />
            </AspectRatio>
          </Box>
        )}
      </Flex>
    </Container>
  );
};

export default CampOverview;
