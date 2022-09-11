import React, { useEffect, useMemo, useState } from "react";
import { MultiValue } from "chakra-react-select";
import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  Tag,
  Text,
} from "@chakra-ui/react";
import { CampResponse } from "../../../types/CampsTypes";
import { UserResponse, UserSelectOption } from "../../../types/UserTypes";
import UserAPIClient from "../../../APIClients/UserAPIClient";

import costIcon from "../../../assets/coin.svg";
import locationIcon from "../../../assets/location.svg";
import ageIcon from "../../../assets/person.svg";

import UserSelect from "./UserSelect";
import {
  locationString,
  campStatus,
  CampStatusColor,
} from "../../../utils/CampUtils";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";

type CampDetailsProps = {
  camp: CampResponse;
  setCamp: (camp: CampResponse) => void;
};

const CampDetails = ({ camp, setCamp }: CampDetailsProps): JSX.Element => {
  const [users, setUsers] = useState([] as UserResponse[]);
  const status = campStatus(camp);

  useEffect(() => {
    const getUsers = async () => {
      const userResponse = await UserAPIClient.getAllUsers();
      if (userResponse) {
        setUsers(userResponse);
      }
    };
    getUsers();
  }, []);

  // send request for updating the camp 500ms after last change to camp state.
  // this is to prevent sending requests while the user is still typing out volunteers.
  useEffect(() => {
    const updateCamp = async () => {
      await CampsAPIClient.editCampById(camp.id, camp);
    };

    if (camp.id) {
      const timeOutId = setTimeout(() => updateCamp(), 500);
      return () => clearTimeout(timeOutId);
    }
    return () => {};
  }, [camp]);

  const userSelectOptions = useMemo(() => {
    return users.map((user) => {
      return {
        label: `${user.firstName} ${user.lastName}`,
        email: user.email,
        value: user.id,
      };
    });
  }, [users]);

  const selectedCoordinators = userSelectOptions.filter((user) =>
    camp.campCoordinators?.includes(user.value),
  );
  const selectedCounsellors = userSelectOptions.filter((user) =>
    camp.campCounsellors?.includes(user.value),
  );

  const handleCoordinatorChange = (newValue: MultiValue<UserSelectOption>) => {
    const campCoordinators = newValue.map((user) => user.value);
    setCamp({ ...camp, campCoordinators });
  };

  const handleCounsellorChange = (newValue: MultiValue<UserSelectOption>) => {
    const campCounsellors = newValue.map((user) => user.value);
    setCamp({ ...camp, campCounsellors });
  };

  const handleVolunteerChange = (e: any) => {
    setCamp({ ...camp, volunteers: e.target.value });
  };

  return (
    <Flex>
      <Box width="60%">
        <HStack width="100%" marginBottom="8px" alignItems="center">
          <Text align="left" textStyle="displayXLarge" marginBottom="8px">
            {camp.name}
          </Text>
          <HStack>
            <Tag
              key={status}
              size="md"
              borderRadius="full"
              colorScheme={CampStatusColor[status]}
            >
              {status}
            </Tag>
          </HStack>
        </HStack>
        <Grid
          templateColumns="repeat(5, 1fr)"
          gap={2}
          alignItems="center"
          marginBottom="24px"
        >
          <GridItem>
            <Text textStyle="bodyRegular">Camp Coordinators:</Text>
          </GridItem>
          <GridItem colSpan={4}>
            <UserSelect
              placeholderText="Add camp coordinator(s)"
              options={userSelectOptions}
              onChange={handleCoordinatorChange}
              value={selectedCoordinators}
            />
          </GridItem>
          <GridItem>
            <Text textStyle="bodyRegular">Camp Counsellors:</Text>
          </GridItem>
          <GridItem colSpan={4}>
            <UserSelect
              placeholderText="Add camp counsellor(s)"
              options={userSelectOptions}
              onChange={handleCounsellorChange}
              value={selectedCounsellors}
            />
          </GridItem>
          <GridItem>
            <Text textStyle="bodyRegular">Volunteers:</Text>
          </GridItem>
          <GridItem colSpan={4}>
            <Input
              onChange={handleVolunteerChange}
              placeholder="Add volunteer(s)"
              _placeholder={{ color: "text.grey.100" }}
              size="sm"
              _focusVisible={{ outline: "0" }}
              value={camp.volunteers}
            />
          </GridItem>
        </Grid>
        <Text marginBottom="12px" textStyle="bodyBold" width="100%">
          Camp Details
        </Text>
        <Text marginBottom="16px" textStyle="bodyRegular" width="100%">
          {camp.description}
        </Text>
        <HStack spacing="24px" alignItems="center">
          <HStack>
            <Image
              objectFit="scale-down"
              src={costIcon}
              alt="Cost Icon"
              width="24px"
              height="24px"
            />
            <Text textStyle="bodyRegular">${camp.fee} per day</Text>
          </HStack>
          <HStack>
            <Image
              objectFit="scale-down"
              src={ageIcon}
              alt="Capacity Range Icon"
              width="24px"
              height="24px"
            />
            <Text textStyle="bodyRegular">
              {camp.ageLower} to {camp.ageUpper} years old
            </Text>
          </HStack>
          <HStack>
            <Image
              objectFit="scale-down"
              src={locationIcon}
              alt="Location Icon"
              width="24px"
              height="24px"
            />
            <Text textStyle="bodyRegular">{locationString(camp.location)}</Text>
          </HStack>
        </HStack>
      </Box>
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
    </Flex>
  );
};

export default CampDetails;
