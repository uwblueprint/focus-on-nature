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
import React, { useEffect, useMemo, useState } from "react";
import costIcon from "../../../assets/coin.svg";
import locationIcon from "../../../assets/location.svg";
import ageIcon from "../../../assets/person.svg";
import { CampResponse, CampStatus } from "../../../types/CampsTypes";
import { UserResponse, UserSelectOption } from "../../../types/UserTypes";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import UserSelect from "./UserSelect";
import locationToString from "../../../utils/CampUtils";

const CampOverviewPage = (): JSX.Element => {
  const [users, setUsers] = useState([] as UserResponse[]);
  const [camp, setCamp] = useState<CampResponse>({
    id: "",
    active: false,
    ageLower: 0,
    ageUpper: 0,
    campCoordinators: [],
    campCounsellors: [],
    name: "",
    description: "",
    earlyDropoff: "",
    endTime: "",
    latePickup: "",
    location: {
      streetAddress1: "",
      city: "",
      province: "",
      postalCode: "",
    },
    startTime: "",
    fee: 0,
    volunteers: "",
    campPhotoUrl: "",
  });
  const status = camp?.active ? CampStatus.PUBLISHED : CampStatus.DRAFT;
  const campId = "630a63450eb59852f9d01b1e"; // with camp photo
  // const campId = "62574d7ae89788006c93cf02"; // without camp photo

  const userSelectOptions = useMemo(() => {
    return users.map((user) => {
      return {
        label: `${user.firstName} ${user.lastName}`,
        email: user.email,
        value: user.id,
      };
    });
  }, [users]);

  const selectedCoordinators = useMemo(() => {
    if (camp) {
      return userSelectOptions.filter(
        (user) => camp.campCoordinators.indexOf(user.value) !== -1,
      );
    }
    return [];
  }, [camp, userSelectOptions]);

  const selectedCounsellors = useMemo(() => {
    if (camp) {
      return userSelectOptions.filter(
        (user) => camp.campCounsellors.indexOf(user.value) !== -1,
      );
    }
    return [];
  }, [camp, userSelectOptions]);

  useEffect(() => {
    const getCamp = async () => {
      const campResponse = await CampsAPIClient.getCampById(campId);
      setCamp(campResponse);
    };
    getCamp();

    const getUsers = async () => {
      const userResponse = await UserAPIClient.getAllUsers();
      if (userResponse) {
        const coordinators = userResponse.filter(
          (user) => user.role === "CampCoordinator",
        );
        setUsers(coordinators);
      }
    };
    getUsers();
  }, []);

  const updateCamp = async (newCamp: CampResponse) => {
    console.log("updateCamp");
    if (newCamp.id) {
      await CampsAPIClient.editCampById(newCamp.id, newCamp);
    }
  };

  const handleCoordinatorChange = (newValue: MultiValue<UserSelectOption>) => {
    const coordinators = newValue.map((user) => user.value);
    if (camp) {
      const newCamp = { ...camp, campCoordinators: coordinators };
      setCamp(newCamp);
      updateCamp(newCamp);
    }
  };

  const handleCounsellorChange = (newValue: MultiValue<UserSelectOption>) => {
    const counsellors = newValue.map((user) => user.value);
    if (camp) {
      const newCamp = { ...camp, campCounsellors: counsellors };
      setCamp(newCamp);
      updateCamp(newCamp);
    }
  };

  useEffect(() => {
    if (camp) {
      const timeOutId = setTimeout(() => updateCamp(camp), 500);
      return () => clearTimeout(timeOutId);
    }
    return () => {};
  }, [camp]);

  const handleVolunteerChange = (e: any) => {
    if (camp) {
      setCamp({ ...camp, volunteers: e.target.value });
    }
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
            <GridItem colSpan={3}>
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
            <GridItem colSpan={3}>
              <Input
                onChange={handleVolunteerChange}
                placeholder="Add volunteer(s)"
                _placeholder={{ color: "text.grey.100" }}
                size="md"
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
                width="32px"
                height="32px"
              />
              <Text textStyle="bodyRegular">${camp.fee} per day</Text>
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
                {camp.ageLower} to {camp.ageUpper} years old
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
                {locationToString(camp.location)}
              </Text>
            </HStack>
          </HStack>
        </Box>
        {camp.campPhotoUrl && (
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
                src={camp.campPhotoUrl}
                alt="Camp Image"
              />
            </AspectRatio>
          </Box>
        )}
      </Flex>
    </Container>
  );
};

export default CampOverviewPage;
