import React from "react";
import {
  Alert as ChakraAlert,
  AlertDescription,
  AlertIcon,
  AlertProps,
} from "@chakra-ui/react";

function Alert({
  status,
  description,
}: {
  status: AlertProps["status"];
  description: string;
}): JSX.Element {
  return (
    <ChakraAlert
      status={status}
      style={{
        position: "absolute",
        left: "0",
        right: "0",
        marginLeft: "auto",
        marginRight: "auto",
        width: "90vw",
        bottom: "20px",
        zIndex: 100,
      }}
    >
      <AlertIcon />
      <AlertDescription>{description}</AlertDescription>
    </ChakraAlert>
  );
}

export default Alert;
