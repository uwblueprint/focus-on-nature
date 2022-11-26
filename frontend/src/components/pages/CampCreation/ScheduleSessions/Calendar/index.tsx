import { Box, VStack } from "@chakra-ui/react";
import React, { useState, useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import CalendarHeader from "./CalendarHeader";
import {
  getMonthIndex,
  getMonthName,
  getSessionBorderColor,
  getSessionFillColor,
} from "../../../../../utils/CampUtils";
import { CreateCampSession } from "../../../../../types/CampsTypes";
import colors from "../../../../../theme/colors";

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
  const today = new Date();

  const [displayMonth, setDisplayMonth] = useState<string>(getMonthName(today));
  const [displayYear, setDisplayYear] = useState<string>(
    today.getFullYear().toString(),
  );

  const calendar = useRef<FullCalendar>(null);

  const jumpCalendarToToday = () => {
    if (calendar.current) {
      calendar.current.getApi().today();
    }

    // When user changes date via dropdowns, they are the month/year source of truth
    // When user changes date via today button, update dropdowns to reflect this
    setDisplayMonth(getMonthName(today));
    setDisplayYear(today.getFullYear().toString());
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
              formattedSessions.push({
                title: `Session ${sessionIndex + 1}`,
                start: currentDate,
                end: undefined,
                backgroundColor: getSessionFillColor(sessionIndex),
                borderColor: getSessionBorderColor(sessionIndex),
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
      <Box w="50vw">
        <FullCalendar
          ref={calendar}
          headerToolbar={false}
          plugins={[dayGridPlugin]}
          events={mapSessionsDataToCalendarSessions(sessions)}
          eventTextColor={colors.text.default[100]}
          navLinks={false}
          fixedWeekCount={false}
          defaultAllDay
          handleWindowResize
          aspectRatio={1.75}
        />
      </Box>
    </VStack>
  );
};

export default SessionsCalendar;
