import React from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";

type EditCardHeaderProps = {
  title: string;
  onClick: () => void;
  editing: boolean;
};

const EditCardHeader = ({
  title,
  onClick,
  editing,
}: EditCardHeaderProps): React.ReactElement => {
  return (
    <Box bg="background.white.100" rounded="xl">
      <Heading textStyle="displayLarge">
        <Flex py={6} px={{ sm: "5", lg: "20" }} alignItems="center">
          <Text textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}>
            {title}
          </Text>
          <Spacer />
          <Button
            variant="secondary"
            textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
            disabled={editing}
            w={{ sm: "80px", lg: "100px" }}
            h={{ sm: "30px", lg: "40px" }}
            onClick={onClick}
          >
            Edit
          </Button>
        </Flex>
      </Heading>
      <Divider borderColor="border.secondary.100" />
    </Box>
  );
};

export default EditCardHeader;
