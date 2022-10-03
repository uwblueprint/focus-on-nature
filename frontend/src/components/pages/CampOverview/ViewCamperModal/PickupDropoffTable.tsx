import React from "react";

import { Tr, Td, Table, TableContainer, Tbody } from "@chakra-ui/react";
import PickupDropoffTableRow from "./PickupDropoffTableRow";

const getUniqueWeekdays = (
  dateArr1: Date[] | undefined,
  dateArr2: Date[] | undefined,
): Set<number> => {
  const uniqueWeekdays = new Set<number>();
  dateArr1?.forEach((date) => {
    uniqueWeekdays.add(date.getDay());
  });
  dateArr2?.forEach((date) => {
    uniqueWeekdays.add(date.getDay());
  });
  return uniqueWeekdays;
};

type PickupDropoffTableProps = {
  earlyDropoff: Date[] | undefined;
  latePickup: Date[] | undefined;
};

const PickupDropoffTable = ({
  earlyDropoff,
  latePickup,
}: PickupDropoffTableProps): JSX.Element => {
  // Parse the date arrays to use methods like getDay() or getHours().
  const parsedEarlyDropoff: Date[] | undefined = earlyDropoff?.map(
    (date) => new Date(date),
  );
  const parsedLatePickup: Date[] | undefined = latePickup?.map(
    (date) => new Date(date),
  );

  const weekdaysToMap: Set<number> = getUniqueWeekdays(
    parsedEarlyDropoff,
    parsedLatePickup,
  );

  return (
    <TableContainer>
      <Table variant="unstyled">
        <Tbody>
          {weekdaysToMap.size > 0 ? (
            Array.from(weekdaysToMap).map((weekday) => {
              return (
                <PickupDropoffTableRow
                  key={`weekday_${weekday}`}
                  date={weekday}
                  earlyDropoff={parsedEarlyDropoff}
                  latePickup={parsedLatePickup}
                />
              );
            })
          ) : (
            <Tr>
              <Td textStyle="bodyRegular" pl={0} pt={2} pb={0}>
                No early dropoff or late pickup selected.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default PickupDropoffTable;
