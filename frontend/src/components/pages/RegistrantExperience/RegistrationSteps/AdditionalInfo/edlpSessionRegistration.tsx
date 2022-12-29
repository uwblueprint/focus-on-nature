import React, { Dispatch, SetStateAction } from "react";
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
  getFormattedDateString,
  formatAMPM,
  getFormattedSingleDateString,
} from "../../../../../utils/CampUtils";

type EDLPSessionRegistrationProps = {
  selectedSessionIndex: number;
  camp: CampResponse;
  edlpCost: number;
  session: CampSession;
  edlpChoices: EdlpChoice[][];
  setEdlpChoices: Dispatch<SetStateAction<EdlpChoice[][]>>;
};

export type EdlpChoice = {
  date: string; // The date of 1 particular day of camp (sessions consist of multiple days)
  edlp: string[]; // edlp = [string, string] where index 0 = ed and index 1 = lp, each representing the time slot of edlp selected
  edlpCost: number[]; // The cost of the ed (index 0) and lp (index 1) for the selected day per camper
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
  edlpCost,
  session,
  edlpChoices,
  setEdlpChoices,
}: EDLPSessionRegistrationProps): React.ReactElement => {
  const edIntervals = ["-"].concat(
    computeIntervals(camp.startTime, camp.earlyDropoff, false),
  );

  const lpIntervals = ["-"].concat(
    computeIntervals(camp.endTime, camp.latePickup, true),
  );

  const getEdCostForDay = (date: string): number => {
    return (
      edlpChoices[selectedSessionIndex].find((day) => day.date === date)
        ?.edlpCost[0] ?? 0
    );
  };

  const getLpCostForDay = (date: string): number => {
    return (
      edlpChoices[selectedSessionIndex].find((day) => day.date === date)
        ?.edlpCost[1] ?? 0
    );
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
    dayIndex: number,
    timeInterval: string,
    isLatePickup: boolean,
  ) => {
    const temp = edlpChoices;
    temp[selectedSessionIndex][dayIndex].edlp[
      isLatePickup ? 1 : 0
    ] = timeInterval;
    temp[selectedSessionIndex][dayIndex].edlpCost[isLatePickup ? 1 : 0] =
      numSlots * edlpCost;
    setEdlpChoices(temp);
    forceUpdate();
  };

  const getEdOptions = (day: string) =>
    edIntervals.map((edInterval: string, intervalIndex: number) => {
      // edIntervals look like this: ["-", "8:00", "8:30", "9:00", "9:30"] for a start time of 10:00 and ed starting at 8:00
      // numSlots determines how many 30 min slots of ED the option equates to
      const numSlots =
        edInterval === "-" ? 0 : edIntervals.length - intervalIndex;
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
    dateIndex: number,
    isLatePickup: boolean,
  ): number => {
    const interval =
      edlpChoices[selectedSessionIndex][dateIndex].edlp[isLatePickup ? 1 : 0];
    if (isLatePickup) {
      return lpIntervals.indexOf(interval);
    }
    return interval === "-"
      ? 0
      : edIntervals.length - edIntervals.indexOf(interval);
  };

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
          bg="white"
          padding={{ base: "12px 20px", sm: "16px 40px", md: "32px 80px" }}
          borderRadius="10px"
          _expanded={{
            borderBottomRadius: "0",
            borderBottom: "1px solid #EEEFF1",
          }}
        >
          <Box as="span" flex="1" textAlign="left">
            <Text
              as="span"
              textStyle={{ base: "xSmallBold", md: "displayMediumBold" }}
            >
              Session:{" "}
            </Text>
            <Text
              as="span"
              textStyle={{ base: "xSmallBold", md: "displayMediumBold" }}
            >
              {getFormattedDateString(session.dates)}
            </Text>
            <Text textStyle={{ base: "xSmallRegular", md: "buttonRegular" }}>
              {formatAMPM(camp.startTime)} - {formatAMPM(camp.endTime)}
            </Text>
          </Box>
          <AccordionIcon boxSize={10} />
        </AccordionButton>
      </h2>

      <AccordionPanel padding="0">
        <Hide below="600px">
          <Box
            padding={{ base: "12px 20px", sm: "16px 40px", md: "32px 80px" }}
          >
            <Table
              variant="simple"
              colorScheme="blackAlpha"
              background="#FBFBFB"
              size="sm"
            >
              <Thead>
                <Tr textAlign="left">
                  <Td color="text.default.100" border="none" padding="3px">
                    Date
                  </Td>
                  <Td color="text.default.100" border="none" padding="3px">
                    Early Dropoff
                  </Td>
                  <Td color="text.default.100" border="none" padding="3px">
                    Late Pickup
                  </Td>
                  <Td color="text.default.100" border="none" padding="3px">
                    Cost/Child
                  </Td>
                </Tr>
              </Thead>
              <Tbody>
                {session.dates.map((date: string, dateIndex: number) => {
                  return (
                    <Tr key={`${date}_edlp_row`}>
                      <Td border="none" textStyle="buttonRegular" padding="3px">
                        {getFormattedSingleDateString(date)}
                      </Td>
                      <Td border="none" padding="3px">
                        <Select
                          width="120px"
                          defaultValue={getDefaultSelectOption(
                            dateIndex,
                            false,
                          )}
                          onChange={(event) => {
                            onSelectEDLP(
                              Number(event.target.value),
                              dateIndex,
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
                          defaultValue={getDefaultSelectOption(dateIndex, true)}
                          onChange={(event) => {
                            onSelectEDLP(
                              Number(event.target.value),
                              dateIndex,
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
                      <Td border="none" padding="3px">
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
          {session.dates.map((date: string, dateIndex: number) => {
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
                  defaultValue={getDefaultSelectOption(dateIndex, true)}
                  onChange={(event) => {
                    onSelectEDLP(
                      Number(event.target.value),
                      dateIndex,
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
                  defaultValue={getDefaultSelectOption(dateIndex, true)}
                  onChange={(event) => {
                    onSelectEDLP(
                      Number(event.target.value),
                      dateIndex,
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
          bg="white"
          padding={{ base: "12px 20px", sm: "16px 40px", md: "32px 80px" }}
          borderBottomRadius="10px"
        >
          <Text
            as="span"
            textStyle={{ base: "xSmallBold", md: "displayMediumBold" }}
          >
            Total Cost:{" "}
          </Text>
          <Text
            as="span"
            textStyle={{ base: "xSmallRegular", md: "displayMediumRegular" }}
          >
            ${getTotalEdlpCostForSession()} per camper
          </Text>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default EDLPSessionRegistration;
