import React from "react";
import { Box, Flex, Text, Tag } from "@chakra-ui/react";
import { getFormattedDateString } from "../../../utils/CampUtils";
import { CampSession } from "../../../types/CampsTypes";

type PreviewModalSessionRowProps = {
  sessionNum: number;
  status: string;
  session: CampSession;
};

const PreviewModalSessionRow = ({
  sessionNum,
  status,
  session,
}: PreviewModalSessionRowProps): JSX.Element => {
  return (
    <Box marginBottom="12px">
      <Flex>
        <>
          <Text textStyle="subHeading" marginRight="12px">
            Session {sessionNum}
          </Text>
          {(() => {
            if (status === "Published") {
              return session.campers.length >= session.capacity ? (
                <Tag colorScheme="orange" borderRadius="full" size="sm">
                  Session full
                </Tag>
              ) : (
                <Tag colorScheme="green" borderRadius="full" size="sm">
                  Session available
                </Tag>
              );
            }
            return "";
          })()}
        </>
      </Flex>
      <Text textStyle="subHeading">
        {getFormattedDateString(session.dates)}
      </Text>
      <Text textStyle="caption">
        Registrations (
        <Text
          as="span"
          textStyle={
            status === "Published" && session.campers.length >= session.capacity
              ? "subHeading"
              : "caption"
          }
        >
          {session.campers.length}/{session.capacity}
        </Text>
        ) | Waitlist ({session.waitlist.length})
      </Text>
    </Box>
  );
};

export default PreviewModalSessionRow;
