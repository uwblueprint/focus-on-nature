import React, { Dispatch, SetStateAction, useMemo } from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Box,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  Select,
  Hide,
} from "@chakra-ui/react";
import { CampResponse, CampSession } from "../../../../../types/CampsTypes";
import {
  getFormattedDateRangeStringFromStringArray,
  formatAMPM,
  getFormattedSingleDateString,
  sortDatestrings,
} from "../../../../../utils/CampUtils";
import { EdlpSelections } from "../../../../../types/RegistrationTypes";
import { EDLP_PLACEHOLDER_TIMESLOT } from "../../../../../constants/RegistrationConstants";

type EDLPSessionRegistrationProps = {
  selectedSessionIndex: number;
  camp: CampResponse;
  edCost: number;
  lpCost: number;
  session: CampSession;
  edlpSelections: EdlpSelections;
  setEdlpSelections: Dispatch<SetStateAction<EdlpSelections>>;
};

const computeIntervals = (
  campTime: string,
  edlpTime: string,
  isPickup: boolean,
): string[] => {
  const a = [];
  const startValue = edlpTime;
  const endValue = campTime;
  const intervalValue = 30;
  let startDate = new Date(`1/1/2022 ${startValue}`);
  const endDate = new Date(`1/1/2022 ${endValue}`);

  const offset = intervalValue * 1000 * 60;

  if (isPickup)
    while (startDate > endDate) {
      a.push(
        startDate.toLocaleString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
      startDate = new Date(startDate.getTime() - offset);
    }

  while (startDate < endDate) {
    a.push(
      startDate.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    );
    startDate = new Date(startDate.getTime() + offset);
  }

  return isPickup ? a.reverse() : a;
};

const EDLPSessionRegistration = ({
  selectedSessionIndex,
  camp,
  edCost,
  lpCost,
  session,
  edlpSelections,
  setEdlpSelections,
}: EDLPSessionRegistrationProps): React.ReactElement => {
  const edIntervals = [EDLP_PLACEHOLDER_TIMESLOT].concat(
    computeIntervals(camp.startTime, camp.earlyDropoff, false),
  );

  const lpIntervals = [EDLP_PLACEHOLDER_TIMESLOT].concat(
    computeIntervals(camp.endTime, camp.latePickup, true),
  );

  const getEdCostForDay = (date: string): number => {
    return edlpSelections[selectedSessionIndex][date]?.earlyDropoff.cost ?? 0;
  };

  const getLpCostForDay = (date: string): number => {
    return edlpSelections[selectedSessionIndex][date]?.latePickup.cost ?? 0;
  };

  const getTotalEdlpCostForDay = (date: string): number => {
    return getEdCostForDay(date) + getLpCostForDay(date);
  };

  const getTotalEdlpCostForSession = (): number => {
    return session.dates.reduce(
      (sumCost, date) => sumCost + getTotalEdlpCostForDay(date),
      0,
    );
  };

  /* eslint-disable-next-line */
  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const onSelectEDLP = (
    numSlots: number,
    date: string,
    timeInterval: string,
    isLatePickup: boolean,
  ) => {
    const newChoices = edlpSelections;

    const changedSlot = {
      timeSlot: timeInterval,
      units: numSlots,
      cost: numSlots * (isLatePickup ? lpCost : edCost),
    };

    if (newChoices[selectedSessionIndex][date]) {
      if (isLatePickup) {
        newChoices[selectedSessionIndex][date].latePickup = changedSlot;
      } else {
        newChoices[selectedSessionIndex][date].earlyDropoff = changedSlot;
      }
    }

    setEdlpSelections(edlpSelections);
    forceUpdate();
  };

  const getEdOptions = (day: string) =>
    edIntervals.map((edInterval: string, intervalIndex: number) => {
      // edIntervals look like this: ["-", "8:00", "8:30", "9:00", "9:30"] for a start time of 10:00 and ed starting at 8:00
      // numSlots determines how many 30 min slots of ED the option equates to
      const numSlots =
        edInterval === EDLP_PLACEHOLDER_TIMESLOT
          ? 0
          : edIntervals.length - intervalIndex;
      return (
        <option key={`${day}_edOption_${intervalIndex}`} value={numSlots}>
          {edInterval}
        </option>
      );
    });

  const getLpOptions = (day: string) =>
    lpIntervals.map((lpInterval: string, intervalIndex: number) => {
      // lpIntervals look like this: ["-", "15:00", "15:30", "16:00", "16:30"] for an end time of 15:00 and lp ending at 17:00
      // numSlots determines how many 30 min slots of LP the option equates to
      const numSlots = intervalIndex;
      return (
        <option key={`${day}_lpOption_${intervalIndex}`} value={numSlots}>
          {lpInterval}
        </option>
      );
    });

  const getDefaultSelectOption = (
    date: string,
    isLatePickup: boolean,
  ): number => {
    const interval = isLatePickup
      ? edlpSelections[selectedSessionIndex][date]?.latePickup.timeSlot
      : edlpSelections[selectedSessionIndex][date]?.earlyDropoff.timeSlot ??
        EDLP_PLACEHOLDER_TIMESLOT;
    if (isLatePickup) {
      return lpIntervals.indexOf(interval);
    }
    return interval === EDLP_PLACEHOLDER_TIMESLOT
      ? 0
      : edIntervals.length - edIntervals.indexOf(interval);
  };

  const sortedSessionDates = useMemo(() => sortDatestrings(session.dates), [
    session.dates,
  ]);

  return (
    <AccordionItem
      border="none"
      marginTop="32px"
      bg="#FBFBFB"
      borderRadius="10px"
      boxShadow="0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)"
    >
      {/* Each accordionButton must be wrapped in a heading tag */}
      <h2>
        <AccordionButton
          bg="background.white.100"
          px={{ sm: "5", lg: "20" }}
          py={{ sm: "4", lg: "8" }}
          borderRadius="10px"
          _expanded={{
            borderBottomRadius: "0",
            borderBottom: "1px solid #EEEFF1",
          }}
        >
          <Box as="span" flex="1" textAlign="left">
            <Text
              as="span"
              textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}
            >
              Session:{" "}
            </Text>
            <Text
              as="span"
              textStyle={{ sm: "xSmallBold", lg: "displayLarge" }}
            >
              {getFormattedDateRangeStringFromStringArray(session.dates)}
            </Text>
            <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}>
              {formatAMPM(camp.startTime)} - {formatAMPM(camp.endTime)}
            </Text>
          </Box>
          <AccordionIcon boxSize={10} />
        </AccordionButton>
      </h2>

      <AccordionPanel padding="0">
        <Hide below="600px">
          <Box
            padding={{ sm: "16px 40px", lg: "32px 80px" }}
            bg="background.grey.500"
          >
            <Table variant="simple" colorScheme="blackAlpha" size="sm">
              <Thead>
                <Tr textAlign="left">
                  <Td color="text.default.100" border="none" padding="3px">
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      Date
                    </Text>
                  </Td>
                  <Td color="text.default.100" border="none" padding="3px">
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      Early Dropoff
                    </Text>
                  </Td>
                  <Td color="text.default.100" border="none" padding="3px">
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      Late Pickup
                    </Text>
                  </Td>
                  <Td color="text.default.100" border="none" padding="3px">
                    <Text
                      textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}
                    >
                      Cost/Child
                    </Text>
                  </Td>
                </Tr>
              </Thead>
              <Tbody>
                {sortedSessionDates.map((date: string) => {
                  return (
                    <Tr key={`${date}_edlp_row`}>
                      <Td
                        border="none"
                        textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}
                        padding="3px"
                      >
                        {getFormattedSingleDateString(date)}
                      </Td>
                      <Td border="none" padding="3px">
                        <Select
                          width="120px"
                          defaultValue={getDefaultSelectOption(date, false)}
                          textStyle={{
                            sm: "xSmallRegular",
                            lg: "buttonRegular",
                          }}
                          onChange={(event) => {
                            onSelectEDLP(
                              Number(event.target.value),
                              date,
                              event.target.options[
                                event.target.options.selectedIndex
                              ].text,
                              false,
                            );
                          }}
                        >
                          {getEdOptions(date)}
                        </Select>
                      </Td>
                      <Td border="none" padding="3px">
                        <Select
                          width="120px"
                          defaultValue={getDefaultSelectOption(date, true)}
                          textStyle={{
                            sm: "xSmallRegular",
                            lg: "buttonRegular",
                          }}
                          onChange={(event) => {
                            onSelectEDLP(
                              Number(event.target.value),
                              date,
                              event.target.options[
                                event.target.options.selectedIndex
                              ].text,
                              true,
                            );
                          }}
                        >
                          {getLpOptions(date)}
                        </Select>
                      </Td>
                      <Td
                        border="none"
                        textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}
                        padding="3px"
                      >
                        ${getTotalEdlpCostForDay(date)}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Hide>
        <Hide above="600px">
          {sortedSessionDates.map((date: string) => {
            return (
              <Box
                padding={{
                  base: "12px 20px",
                  sm: "16px 40px",
                  md: "32px 80px",
                }}
                key={77 * session.dates.indexOf(date)}
              >
                <Text as="span" textStyle="xSmallBold">
                  {getFormattedSingleDateString(date)}
                </Text>
                <Text as="i" textStyle="xSmallRegular">
                  - ${getTotalEdlpCostForDay(date)}
                </Text>

                <Text textStyle="xSmallRegular" marginTop="8px">
                  Early Dropoff
                </Text>
                <Select
                  minWidth="120px"
                  marginTop="8px"
                  defaultValue={getDefaultSelectOption(date, true)}
                  onChange={(event) => {
                    onSelectEDLP(
                      Number(event.target.value),
                      date,
                      event.target.options[event.target.options.selectedIndex]
                        .text,
                      false,
                    );
                  }}
                >
                  {getEdOptions(date)}
                </Select>

                <Text textStyle="xSmallRegular" marginTop="8px">
                  Late Pickup
                </Text>
                <Select
                  minWidth="120px"
                  marginTop="8px"
                  defaultValue={getDefaultSelectOption(date, true)}
                  onChange={(event) => {
                    onSelectEDLP(
                      Number(event.target.value),
                      date,
                      event.target.options[event.target.options.selectedIndex]
                        .text,
                      true,
                    );
                  }}
                >
                  {getLpOptions(date)}
                </Select>
              </Box>
            );
          })}
        </Hide>
        <Box
          bg="background.white.100"
          px={{ sm: "5", lg: "20" }}
          py={{ sm: "4", lg: "8" }}
          borderBottomRadius="10px"
          borderTop="1px solid #EEEFF1"
        >
          <Text
            as="span"
            textStyle={{ sm: "xSmallBold", lg: "displayMediumBold" }}
          >
            Total Cost:{" "}
          </Text>
          <Text
            as="span"
            textStyle={{ sm: "xSmallRegular", lg: "displayMediumRegular" }}
          >
            ${getTotalEdlpCostForSession()} per camper
          </Text>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default EDLPSessionRegistration;
