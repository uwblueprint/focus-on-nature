import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Tag,
  HStack,
  Text,
  Button,
  FormControl,
} from "@chakra-ui/react";
import { ManageCampSessionDetails } from "../../../../types/CampsTypes";
import { getFormattedSessionDatetime } from "../../../../utils/CampUtils";

interface SessionRowTitleProps {
  session: ManageCampSessionDetails;
  index: number;
}

const SessionRowTitle = ({
  session,
  index,
}: SessionRowTitleProps): JSX.Element => {
  return (
    <HStack spacing={1}>
      <Text textStyle="buttonSemiBold" color="text.default.100">
        Session {index + 1}
      </Text>
      <Text
        textStyle="buttonSemiBold"
        color={
          session.registeredCampers === session.capacity
            ? "text.critical.100"
            : "text.default.100"
        }
      >
        ({session.registeredCampers}/{session.capacity})
      </Text>
    </HStack>
  );
};

interface ManageSessionsModalTableProps {
  campStartTime: string;
  campEndTime: string;
  sessions: Array<ManageCampSessionDetails>;
  deletedSessions: Set<string>;
  updatedCapacities: Map<string, number | undefined>;
  onEditCapacity: (
    updatedSessionId: ManageCampSessionDetails,
    updatedCapacity: string,
  ) => void;
  onClickDeleteSession: (deleteSessionId: ManageCampSessionDetails) => void;
}

const ManageSessionsModalTable = ({
  campStartTime,
  campEndTime,
  sessions,
  deletedSessions,
  updatedCapacities,
  onEditCapacity,
  onClickDeleteSession,
}: ManageSessionsModalTableProps): JSX.Element => {
  const sessionIsFull = (session: ManageCampSessionDetails): boolean =>
    session.capacity === session.registeredCampers;

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th textTransform="none">
              <Text textStyle="bodyRegular">Camp Session</Text>
            </Th>
            <Th textTransform="none">
              <Text textStyle="bodyRegular">Camp Capacity</Text>
            </Th>
            <Th>{}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sessions.map((session: ManageCampSessionDetails, index) => {
            return (
              <Tr key={index}>
                <Td
                  layerStyle={deletedSessions.has(session.id) ? "disabled" : ""}
                >
                  <HStack>
                    <SessionRowTitle session={session} index={index} />
                    {sessionIsFull(session) ? (
                      <Tag colorScheme="orange" borderRadius="full" size="sm">
                        Session Full
                      </Tag>
                    ) : (
                      <Tag colorScheme="green" borderRadius="full" size="sm">
                        Spots Available
                      </Tag>
                    )}
                  </HStack>
                  <Text textStyle="bodyRegular">
                    {getFormattedSessionDatetime(
                      session.dates,
                      campStartTime,
                      campEndTime,
                    )}
                  </Text>
                </Td>
                <Td>
                  <FormControl
                    isInvalid={
                      session.registeredCampers >
                      (updatedCapacities.get(session.id) ??
                        session.registeredCampers)
                    }
                  >
                    <Input
                      w="75px"
                      disabled={deletedSessions.has(session.id)}
                      textStyle="bodyRegular"
                      placeholder={`${session.capacity}`}
                      value={updatedCapacities.get(session.id) ?? ""}
                      onChange={(event) =>
                        onEditCapacity(session, event.target.value)
                      }
                    />
                  </FormControl>
                </Td>
                <Td isNumeric>
                  <Button
                    w="150px"
                    colorScheme={
                      deletedSessions.has(session.id) ? "green" : "red"
                    }
                    variant="outline"
                    onClick={() => onClickDeleteSession(session)}
                  >
                    {deletedSessions.has(session.id)
                      ? "Undo delete"
                      : "Delete session"}
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ManageSessionsModalTable;
