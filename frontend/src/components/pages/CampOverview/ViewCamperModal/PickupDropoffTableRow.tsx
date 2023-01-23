import React from "react";

import { Text, Tr, Td, HStack } from "@chakra-ui/react";

import { ReactComponent as SunriseIcon } from "../../../../assets/icon_sunrise.svg";
import { ReactComponent as SunsetIcon } from "../../../../assets/icon_sunset.svg";

const weekdayMap: { [key: number]: string } = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

// findTime consumes an array of dates and a specified weekday (i.e. Sunday = 0, Monday = 1, etc.).
// Returns the time of the first date in the array that matches the weekday (i.e. 8:00 AM) or XX:XX if none found.
const findTime = (dates: Date[] | undefined, weekday: number): string => {
  // Try to find a date corresponding to the specified weekday in the dates array.
  const foundDate: Date | undefined = dates?.find(
    (date) => date.getDay() === weekday,
  );

  // Return the formatted time of the date if found.
  if (foundDate) {
    let hours = foundDate.getHours();
    const afternoon = hours > 12;
    hours %= 12;
    const finalTime = `${hours}:${foundDate
      .getMinutes()
      .toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })} ${afternoon ? "PM" : "AM"}`;
    return finalTime;
  }

  return "XX:XX";
};

type PickupDropoffTimeProps = {
  time: string;
  pickup: boolean;
};

const PickupDropoffTime = ({
  time,
  pickup,
}: PickupDropoffTimeProps): JSX.Element => {
  const color = time === "XX:XX" ? "silver" : "black";

  return (
    <Td pl={0} pt={2} pb={0} color={color}>
      <HStack>
        {pickup ? <SunsetIcon fill={color} /> : <SunriseIcon fill={color} />}
        <Text textStyle="bodyRegular" color={color}>
          {time}
        </Text>
      </HStack>
    </Td>
  );
};

type PickupDropoffTableRowProps = {
  date: number;
  earlyDropoff: Date[] | undefined;
  latePickup: Date[] | undefined;
};

const PickupDropoffTableRow = ({
  date,
  earlyDropoff,
  latePickup,
}: PickupDropoffTableRowProps): JSX.Element => {
  return (
    <Tr>
      <Td textStyle="bodyBold" pl={0} pt={2} pb={0}>
        {weekdayMap[date]}
      </Td>
      <PickupDropoffTime time={findTime(earlyDropoff, date)} pickup={false} />
      <PickupDropoffTime time={findTime(latePickup, date)} pickup />
    </Tr>
  );
};

export default PickupDropoffTableRow;
