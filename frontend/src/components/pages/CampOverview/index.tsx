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
import React, { useEffect, useState } from "react";
import costIcon from "../../../assets/coin.svg";
import locationIcon from "../../../assets/location.svg";
import ageIcon from "../../../assets/person.svg";
import { Camp } from "../../../types/CampsTypes";
import { UserResponse } from "../../../types/UserTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import SelectComponent from "./SelectComponent";

// TODO: update the statuses
enum Status {
  PUBLISHED = "Published",
  DRAFT = "Draft",
}

const CampOverview = (): JSX.Element => {
  const [users, setUsers] = React.useState([] as UserResponse[]);
  const [camp, setCamp] = useState<Camp>();
  const campId = "62574cf9e89788006c93cefe"; // with camp photo
  // const campId = "62574d7ae89788006c93cf02"; // without camp photo

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

  const formattedUsers = React.useMemo(
    () =>
      users.map((user) => {
        return {
          value: user.id,
          label: `${user.firstName} ${user.lastName}`,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        };
      }),
    [users],
  );

  const handleChange = (
    e: any,
    field: "coordinators" | "counsellors" | "volunteers",
  ) => {
    const updateCamp = async (updatedFields: any) => {
      const updatedCamp = await CampsAPIClient.editCampById(
        camp!.id,
        updatedFields,
      );
      setCamp(updatedCamp);
    };

    let updatedFields;
    switch (field) {
      case "coordinators":
      case "counsellors":
        updatedFields = {
          [field]: e.map((coordinator: any) => coordinator.value),
        };
        break;
      case "volunteers":
      default:
        updatedFields = { volunteers: e.target.value };
        break;
    }
    updateCamp(updatedFields);
  };

  return (
    <Container maxWidth="100vw">
      <Flex marginLeft="80px" marginRight="80px">
        <Box width="60%" mt="1rem">
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
                users={formattedUsers}
                onChange={(e: any) => {
                  handleChange(e, "coordinators");
                }}
              />
            </GridItem>
            <GridItem>
              <Text textStyle="bodyRegular">Camp Counsellors:</Text>
            </GridItem>
            <GridItem colSpan={3}>
              <SelectComponent
                placeholderText="Add camp counsellor(s)"
                users={formattedUsers}
                onChange={(e: any) => {
                  handleChange(e, "counsellors");
                }}
              />
            </GridItem>
            <GridItem>
              <Text textStyle="bodyRegular">Volunteers:</Text>
            </GridItem>
            <GridItem colSpan={3}>
              <Input
                onChange={(e) => {
                  handleChange(e, "volunteers");
                }}
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
