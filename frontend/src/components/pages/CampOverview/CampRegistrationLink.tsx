import {
  HStack,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";

const CampRegistrationLink = ({
  linkUrl,
  disabled,
}: {
  linkUrl: string;
  disabled: boolean;
}): JSX.Element => {
  const toast = useToast();

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);

  return (
    <HStack justifyContent="left" marginBottom="8px">
      <InputGroup backgroundColor="white" pointerEvents="none" size="sm">
        <InputLeftElement>
          <LinkIcon color="gray.300" />
        </InputLeftElement>
        <Input disabled placeholder={linkUrl} borderRadius="0" />
      </InputGroup>
      <Button
        colorScheme="green"
        borderRadius="0"
        size="sm"
        disabled={isDisabled}
        onClick={() => {
          setIsDisabled(true);
          setTimeout(() => setIsDisabled(false), 3000);
          navigator.clipboard.writeText(linkUrl);
          toast({
            title: "Copied to clipboard.",
            status: "success",
            duration: 1500,
            variant: "subtle",
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
