import {
  HStack,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import React from "react";

const CampRegistrationLink = ({
  p,
  isDisabled,
}: {
  p: string;
  isDisabled: boolean;
}): JSX.Element => {
  const toast = useToast();

  return (
    <HStack justifyContent="left" marginBottom="8px">
      <InputGroup backgroundColor="white" pointerEvents="none" size="sm">
        <InputLeftElement>
          <LinkIcon color="gray.300" />
        </InputLeftElement>
        <Input disabled placeholder={p} borderRadius="0" />
      </InputGroup>
      <Button
        colorScheme="green"
        borderRadius="0"
        size="sm"
        disabled={isDisabled}
        onClick={() => {
          navigator.clipboard.writeText(p);
          toast({
            title: "Copied to clipboard.",
            status: "success",
            duration: 1500,
            isClosable: true,
          });
        }}
      >
        Copy
      </Button>
    </HStack>
  );
};

export default CampRegistrationLink;