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
import React from "react";
import { useHistory } from "react-router-dom";
import placeHolderImage from "../../../assets/germany.jpeg";

import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";

const CampOverview = (): JSX.Element => {
  const history = useHistory();

  return (
    <>
      <Container variant="baseContainer">
        <Flex>
          <Box width="100%" mt="1rem">
            <Text align="left" marginBottom="13px" textStyle="displayXLarge">
              Waterloo Photography Camp 2022
            </Text>
            <Tag
              size="md"
              borderRadius="full"
              variant="solid"
              colorScheme="orange"
              width="6em"
              px="1.5em"
            />
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
          </Box>
          <Image
            objectFit="scale-down"
            display={{ base: "none", md: "inline" }}
            height="260px"
            ml="5rem"
            alignSelf="flex-end"
            src={placeHolderImage}
            alt="Camp Image"
          />
        </Flex>
        <Text marginBottom="30px" textStyle="bodyBold" width="100%">
          Camp Details
        </Text>
        <Text marginBottom="30px" textStyle="bodyRegular" width="100%">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
          odio nisl. Fusce a laoreet quam. Cras mollis gravida lorem ut commodo.
          Praesent viverra ligula dapibus ligula elementum, nec ultrices velit
          euismod.
        </Text>
      </Container>
    </>
  );
};

export default CampOverview;
