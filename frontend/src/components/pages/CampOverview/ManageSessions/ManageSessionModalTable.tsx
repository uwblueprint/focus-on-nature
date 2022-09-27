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
} from "@chakra-ui/react";
import { ManageCampSessionDetails } from "../../../../types/CampsTypes";

interface ManageSessionsModalTableProps {
  sessions: Array<ManageCampSessionDetails>;
  onEditCapacity: (updatedSession: ManageCampSessionDetails) => void;
  onClickDeleteSession: (session: ManageCampSessionDetails) => void;
}

const ManageSessionsModalTable = ({
  sessions,
  onEditCapacity,
  onClickDeleteSession,
}: ManageSessionsModalTableProps): JSX.Element => {
  const getSessionTitle = (session: ManageCampSessionDetails, index: number): string =>
    `Session ${index + 1} (${session.registeredCampers}/${session.capacity})`;

  const sessionIsFull = (session: ManageCampSessionDetails): boolean =>
    session.capacity === session.registeredCampers;

  const formatDateString = (dateString: string): string =>
    `${dateString.substring(4, 10)},${dateString.substring(10)}`;

  const formatDates = (dates: Array<string>): string => {
    // Expects formatted date string of two dates:
    // Thu Jun 30 2022 00:00:00 GMT+0000 (Coordinated Universal Time)Fri Jul 01 2022 00:00:00 GMT+0000 (Coordinated Universal Time)
    // TODO pass in camp times as well

    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);

    // Don't want the day part of string, eg. "Thu"
    return `${formatDateString(startDate.toDateString())} - ${formatDateString(endDate.toDateString())}`;
  };
      
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
        {/* guarantee session order */}
        <Tbody>
          {sessions.map((session: ManageCampSessionDetails, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <HStack>
                    <Text textStyle="buttonSemiBold">{getSessionTitle(session, index)}</Text>
                    {
                      sessionIsFull(session) ?
                        <Tag colorScheme="orange" borderRadius="full" size="sm">Session Full</Tag>
                        : <Tag colorScheme="green" borderRadius="full" size="sm">Spots Available</Tag>
                    }
                  </HStack>
                  <Text textStyle="bodyRegular">{formatDates(session.dates)}</Text>
                </Td>
                <Td >
                  {/* TODO register inputs in state, onEdit */}
                  <Input w="75px" textStyle="bodyRegular" value={session.capacity}/>
                </Td>
                <Td isNumeric>
                  {/* TOOD alternate state for undo delete, colours here */}
                  <Button onClick={() => onClickDeleteSession(session)}>Delete session</Button>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ManageSessionsModalTable;
