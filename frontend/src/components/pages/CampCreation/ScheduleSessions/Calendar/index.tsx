import { Box, VStack } from "@chakra-ui/react";
import React, { useState, useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import CalendarHeader from "./CalendarHeader";
import { MONTHS } from "../../../../../constants/CampManagementConstants";
import { CreateCampSession } from "../../../../../types/CampsTypes";

const FILL_COLORS = [
  "#FFF6F2",
  "#FCFCFC",
  "#FFF8EC",
  "#ECF2F9",
  "#F1FFF9",
  "#FDF0FB",
  "#EFF0FF",
  "#FFE9E9",
];
const BORDER_COLORS = [
  "#FFA27A",
  "#98C6CD",
  "#E1B878",
  "#8C9196",
  "#95C9B4",
  "#DAA8D2",
  "#8B8ECE",
  "#FF8989",
];

const TEXT_DEFAULT_100 = "#1A1A1A";

const getMonthIndex = (month: string): number => {
  switch (month) {
    case "January":
      return 0;
    case "February":
      return 1;
    case "March":
      return 2;
    case "April":
      return 3;
    case "May":
      return 4;
    case "June":
      return 5;
    case "July":
      return 6;
    case "August":
      return 7;
    case "September":
      return 8;
    case "October":
      return 9;
    case "November":
      return 10;
    case "December":
      return 11;
    default:
      return -1;
  }
};

type SessionsCalendarProps = {
  sessions: CreateCampSession[];
};

type CalendarSession = {
  title: string;
  start: Date;
  end: Date | undefined;
  backgroundColor: string;
  borderColor: string;
};

const SessionsCalendar = ({
  sessions,
}: SessionsCalendarProps): React.ReactElement => {
  // Check that this doesn't refresh unnecessarily
  const today = new Date();

  const [displayMonth, setDisplayMonth] = useState<string>(
    MONTHS[today.getMonth()],
  );
  const [displayYear, setDisplayYear] = useState<string>(
    today.getFullYear().toString(),
  );

  const calendar = useRef<FullCalendar>(null);

  const jumpCalendarToToday = () => {
    if (calendar.current) {
      calendar.current.getApi().today();
    }
  };

  const jumpToDate = (month: string, year: string) => {
    if (calendar.current) {
      const nextDate = new Date(parseInt(year, 10), getMonthIndex(month));
      calendar.current.getApi().gotoDate(nextDate);
    }
  };

  const daysBetween = (dateOne: Date, dateTwo: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000; // ms in a day
    const deltaMs = dateOne.setHours(0, 0, 0) - dateTwo.setHours(0, 0, 0);

    return Math.round(Math.abs(deltaMs / oneDay));
  };

  const isConsecutiveSession = (
    lastAddedStartDate: Date | undefined,
    lastAddedEndDate: Date | undefined,
    currentDate: Date,
  ): boolean => {
    const lastDate: Date | undefined = lastAddedEndDate || lastAddedStartDate;

    if (lastDate) {
      return daysBetween(lastDate, currentDate) === 1;
    }

    return false;
  };

  // Note: end date exclusive for ranges
  const mapSessionsDataToCalendarSessions = (
    inputSessions: CreateCampSession[],
  ): Array<CalendarSession> => {
    console.log(inputSessions);

    const allSessionCalendarSessions = inputSessions.flatMap(
      (session, sessionIndex) => {
        const calendarSessions = session.dates.reduce(
          (formattedSessions: Array<CalendarSession>, currentDate: Date) => {
            const lastAddedEndDate =
              formattedSessions.length === 0
                ? undefined
                : formattedSessions[formattedSessions.length - 1].end;
            const lastAddedStartDate =
              formattedSessions.length === 0
                ? undefined
                : formattedSessions[formattedSessions.length - 1].start;

            if (
              isConsecutiveSession(
                lastAddedStartDate,
                lastAddedEndDate,
                currentDate,
              )
            ) {
              // eslint-disable-next-line no-param-reassign
              formattedSessions[formattedSessions.length - 1].end = currentDate;
            } else {
              const colorIndex = sessionIndex % 8;
              formattedSessions.push({
                title: `Session ${sessionIndex + 1}`,
                start: currentDate,
                end: undefined,
                backgroundColor: FILL_COLORS[colorIndex],
                borderColor: BORDER_COLORS[colorIndex],
              });
            }

            return formattedSessions;
          },
          Array<CalendarSession>(),
        );

        return calendarSessions.map((calendarSession) => {
          const exclusiveEndDate = calendarSession.end
            ? new Date(calendarSession.end.getTime())
            : undefined;
          if (exclusiveEndDate) {
            exclusiveEndDate.setDate(exclusiveEndDate.getDate() + 1);
          }
          return {
            title: calendarSession.title,
            start: calendarSession.start,
            end: exclusiveEndDate,
            backgroundColor: calendarSession.backgroundColor,
            borderColor: calendarSession.borderColor,
          };
        });
      },
    );

    return allSessionCalendarSessions;
  };

  return (
    <VStack spacing={4} align="center">
      <CalendarHeader
        month={displayMonth}
        year={displayYear}
        onClickToday={jumpCalendarToToday}
        onChangeMonthSelection={(newMonth: string) => {
          jumpToDate(newMonth, displayYear);
          setDisplayMonth(newMonth);
        }}
        onChangeYearSelection={(newYear: string) => {
          jumpToDate(displayMonth, newYear);
          setDisplayYear(newYear);
        }}
      />
      <Box w="45vw" h="55vh">
        <FullCalendar
          ref={calendar}
          headerToolbar={false}
          plugins={[dayGridPlugin]}
          events={mapSessionsDataToCalendarSessions(sessions)}
          eventTextColor={TEXT_DEFAULT_100}
          navLinks={false}
          defaultAllDay
          handleWindowResize
        />
      </Box>
    </VStack>
  );
};

export default SessionsCalendar;
