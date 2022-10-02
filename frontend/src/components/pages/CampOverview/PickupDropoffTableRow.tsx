import React from "react";

import { Text, Tr, Td, HStack } from "@chakra-ui/react";

import { ReactComponent as SunriseIcon } from "../../../assets/icon_sunrise.svg";
import { ReactComponent as SunsetIcon } from "../../../assets/icon_sunset.svg";

const weekdayMap: { [key: number]: string } = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
};

// findTime consumes an array of dates and a specified weekday (i.e. Sunday = 0, Monday = 1, etc.).
// Returns the time of the first date in the array that matches the weekday (i.e. 8:00 AM) or XX:XX if none found.
const findTime = (dates: Date[] | undefined, weekday: number) => {
  let finalTime = "XX:XX";

  if (dates) {
    dates.forEach((date) => {
      const parsedDate = new Date(date);
      if (parsedDate.getDay() === weekday) {
        let hours = parsedDate.getHours();
        const afternoon = hours > 12;
        hours %= 12;
        finalTime = `${hours}:${parsedDate
          .getMinutes()
          .toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })} ${afternoon ? "PM" : "AM"}`;
      }
    });
  }

  return finalTime;
};

type PickupDropoffTimeProps = {
  time: string;
  pickup: boolean;
};

const PickupDropoffTime = ({
  time,
  pickup,
}: PickupDropoffTimeProps): JSX.Element => {
  const color = time === "XX:XX" ? "#C4C4C4" : "#000000";

  return (
    <Td p={0} color={color}>
      <HStack>
        {pickup ? <SunriseIcon fill={color} /> : <SunsetIcon fill={color} />}
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
      <Td pl={0} pt={2} pb={0}>
        <PickupDropoffTime time={findTime(earlyDropoff, date)} pickup={false} />
      </Td>
      <Td pl={0} pt={2} pb={0}>
        <PickupDropoffTime time={findTime(latePickup, date)} pickup />
      </Td>
    </Tr>
  );
};

export default PickupDropoffTableRow;
