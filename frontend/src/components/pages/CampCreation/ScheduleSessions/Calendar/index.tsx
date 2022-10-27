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
  start: string | Date;
  end: string | undefined | Date;
  backgroundColor: string;
  borderColor: string;
};

const SessionsCalendar = ({
  sessions,
}: SessionsCalendarProps): React.ReactElement => {
  // Check that this doesn't refresh unnecessarily
  const currentDate = new Date();

  const [displayMonth, setDisplayMonth] = useState<string>(
    MONTHS[currentDate.getMonth()],
  );
  const [displayYear, setDisplayYear] = useState<string>(
    currentDate.getFullYear().toString(),
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

  // Note: end date exclusive for ranges
  const mapSessionsDataToCalendarSessions = (
    inputSessions: CreateCampSession[],
  ): Array<CalendarSession> => {
    console.log(inputSessions);
    // const calendarSessions = inputSessions.flatMap((session, index) => {

    // if days == dates.length => start, end
    // let currentColorIndex = 0;

    const calendarSessions = inputSessions.flatMap((session, index) => {
      return session.dates.map((date) => {
        return {
          title: `Session ${index + 1}`,
          start: date,
          end: undefined,
          backgroundColor: FILL_COLORS[index % 8],
          borderColor: BORDER_COLORS[index % 8],
        };
      });
    });

    // for (let i = 0; i < inputSessions.length; i += 1) {
    // const session = inputSessions[i];
    // const backgroundColor = FILL_COLORS[i % 8];
    // const borderColor = BORDER_COLORS[i % 8];

    // if (daysBetween(session.startDate, session.endDate) === 1) {
    //   console.log(i);
    //   const calendarSession = {
    //     title: `Session ${i + 1}`,
    //     start: session.startDate,
    //     end: session.endDate,
    //     // end: new Date(session.endDate.setDate(session.endDate.getDate() + 1)),
    //     // need this in camp session too
    //     backgroundColor: FILL_COLORS[currentColorIndex],
    //     borderColor: BORDER_COLORS[currentColorIndex],
    //   };
    //   currentColorIndex += 1;
    //   calendarSessions.push(calendarSession);
    // }

    // }

    return calendarSessions;

    // return [
    //   {
    //     title: "Event 1",
    //     start: "2022-11-03",
    //     end: "2022-11-08",
    //     backgroundColor: FILL_COLORS[0],
    //     borderColor: BORDER_COLORS[0],
    //   },
    //   {
    //     title: "Event 2",
    //     start: "2022-11-05",
    //     end: undefined,
    //     backgroundColor: FILL_COLORS[1],
    //     borderColor: BORDER_COLORS[1],
    //   },
    //   {
    //     title: "Event 2",
    //     start: "2022-11-06",
    //     end: undefined,
    //     backgroundColor: FILL_COLORS[1],
    //     borderColor: BORDER_COLORS[1],
    //   },
    //   {
    //     title: "Event 2",
    //     start: "2022-11-07",
    //     end: undefined,
    //     backgroundColor: FILL_COLORS[1],
    //     borderColor: BORDER_COLORS[1],
    //   },
    //   {
    //     title: "Event 3",
    //     start: "2022-11-15",
    //     end: "2022-11-18",
    //     backgroundColor: FILL_COLORS[2],
    //     borderColor: BORDER_COLORS[2],
    //   },
    // ];
  };

  return (
    <VStack spacing={4} align="flex-start">
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
