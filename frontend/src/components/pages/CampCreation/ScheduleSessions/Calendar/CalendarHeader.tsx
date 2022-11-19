import { Button, HStack, Select } from "@chakra-ui/react";
import React from "react";
import {
  MONTHS,
  YEARS,
} from "../../../../../constants/CampManagementConstants";

type CalendarHeaderProps = {
  month: string;
  year: string;
  onClickToday: () => void;
  onChangeMonthSelection: (month: string) => void;
  onChangeYearSelection: (year: string) => void;
};

const CalendarHeader = ({
  month,
  year,
  onClickToday,
  onChangeMonthSelection,
  onChangeYearSelection,
}: CalendarHeaderProps): React.ReactElement => {
  return (
    <HStack spacing={1}>
      <Button
        variant="outline"
        w="100px"
        color="primary.green.100"
        colorScheme="primary.green.100"
        onClick={onClickToday}
      >
        Today
      </Button>
      <Select
        w="150px"
        value={month}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          onChangeMonthSelection(event.currentTarget.value)
        }
      >
        {Object.keys(MONTHS).map((monthName: string) => {
          return <option key={monthName}>{monthName}</option>;
        })}
      </Select>
      <Select
        w="150px"
        value={year}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          onChangeYearSelection(event.currentTarget.value)
        }
      >
        {YEARS.map((yearString: string) => {
          return <option key={yearString}>{yearString}</option>;
        })}
      </Select>
    </HStack>
  );
};

export default CalendarHeader;
