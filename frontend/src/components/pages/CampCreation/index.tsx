import React, { useState, useEffect, useMemo } from "react";

import { useParams, useHistory } from "react-router-dom";

import { Box, VStack, useToast } from "@chakra-ui/react";
import ScheduleSessions from "./ScheduleSessions";
import RegistrationForm from "./RegistrationForm";
import CampCreationPages from "./CampCreationPages";
import CampCreationNavStepper from "./CampCreationNavStepper";
import CampCreationFooter from "./CampCreationFooter";
import { FormTemplate } from "../../../types/AdminTypes";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import {
  CreateFormQuestionRequest,
  CreateCampSession,
  CreateUpdateCampRequest,
  CreateUpdateCampResponse,
} from "../../../types/CampsTypes";
import CampCreationDetails from "./CampDetails";
import CampsAPIClient from "../../../APIClients/CampsAPIClient";
import { getSelectedWeekDaysFromDates } from "../../../utils/CampUtils";
import { CAMPS_PAGE } from "../../../constants/Routes";

const CampCreationPage = (): React.ReactElement => {
  const toast = useToast();
  const history = useHistory();

  // All response state from the three page components.
  const [campName, setCampName] = useState<string>("");
  const [campDescription, setCampDescription] = useState<string>("");
  const [dailyCampFee, setDailyCampFee] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [ageLower, setAgeLower] = useState<number>(0);
  const [ageUpper, setAgeUpper] = useState<number>(0);
  const [campCapacity, setCampCapacity] = useState<number>(0);
  const [offersEDLP, setOffersEDLP] = useState<boolean>(false);
  const [earliestDropOffTime, setEarliestDropOffTime] = useState<string>("");
  const [latestPickUpTime, setLatestPickUpTime] = useState<string>("");
  const [priceEDLP, setPriceEDLP] = useState<number>(0);
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [province, setProvince] = useState<string>("-");
  const [postalCode, setPostalCode] = useState<string>("");
  const [campImageURL, setCampImageURL] = useState<string>("");

  const [scheduledSessions, setScheduledSessions] = React.useState<
    CreateCampSession[]
  >([]);
  const [
    showScheduleSessionCardError,
    setShowScheduleSessionCardError,
  ] = React.useState<boolean>(false);

  const [visitedRegistrationPage, setVisitedRegistrationPage] = useState(false);
  const [showCreationErrors, setShowCreationErrors] = useState<boolean>(false);

  // Variables to determine whether or not all required fields have been filled out.
  // NOTE: This will depend on what type of state a page requires, i.e. determining
  // if a checkbox is checked is different than determining if an input field is filled.

  let isCampDetailsFilled = false;

  const useValidateTimeOrder = (
    start: string,
    end: string,
    canBeEqual = false,
  ): boolean => {
    return useMemo(() => {
      try {
        const [startHours, startMinutes] = start
          .split(":")
          .map((num) => parseInt(num, 10));
        const [endHours, endMinutes] = end
          .split(":")
          .map((num) => parseInt(num, 10));

        if (Number.isNaN(startHours) || Number.isNaN(endHours)) {
          return true;
        }

        if (canBeEqual) {
          return (
            startHours < endHours ||
            (startHours === endHours && startMinutes <= endMinutes)
          );
        }

        return (
          startHours < endHours ||
          (startHours === endHours && startMinutes < endMinutes)
        );
      } catch (error: unknown) {
        return true;
      }
    }, [start, end, canBeEqual]);
  };

  const startTimeBeforeEndTime = useValidateTimeOrder(startTime, endTime);
  const earlyDropoffTimeBeforeLatePickupTime = useValidateTimeOrder(
    earliestDropOffTime,
    latestPickUpTime,
  );
  const earlyDropoffTimeBeforeStartTime = useValidateTimeOrder(
    earliestDropOffTime,
    startTime,
    true,
  );
  const endTimeBeforeLatePickupTime = useValidateTimeOrder(
    endTime,
    latestPickUpTime,
    true,
  );

  // Check if Camp Details are filled in
  if (
    campName &&
    campDescription &&
    dailyCampFee > 0 &&
    startTime &&
    endTime &&
    startTimeBeforeEndTime &&
    ageLower > 0 &&
    ageUpper > 0 &&
    ageLower < ageUpper &&
    (offersEDLP
      ? earliestDropOffTime &&
        latestPickUpTime &&
        priceEDLP > 0 &&
        earlyDropoffTimeBeforeLatePickupTime &&
        earlyDropoffTimeBeforeStartTime &&
        endTimeBeforeLatePickupTime
      : true) &&
    campCapacity > 0 &&
    addressLine1 &&
    city &&
    province !== "-" &&
    postalCode
  )
    isCampDetailsFilled = true;
  else isCampDetailsFilled = false;

  const isScheduleSessionsFilled = scheduledSessions.length !== 0;
  const isRegistrationFormFilled = visitedRegistrationPage;

  const isCurrentStepCompleted = (step: CampCreationPages) => {
    switch (step) {
      case CampCreationPages.CampCreationDetailsPage:
        return isCampDetailsFilled;
      case CampCreationPages.ScheduleSessionsPage:
        return isScheduleSessionsFilled;
      case CampCreationPages.RegistrationFormPage:
        return isRegistrationFormFilled;
      default:
        return false;
    }
  };

  // State of what page to display.
  const [currentPage, setCurrentPage] = useState<CampCreationPages>(
    CampCreationPages.CampCreationDetailsPage,
  );

  // All state for registration form page.

  const [formTemplate, setFormTemplate] = useState<FormTemplate>();

  useEffect(() => {
    const getFormTemplate = async () => {
      const formTemplateFromDB = await AdminAPIClient.getFormTemplate();
      if (formTemplateFromDB) {
        setFormTemplate(formTemplateFromDB);
      }
    };
    getFormTemplate();
  }, []);

  const [customQuestions, setCustomQuestions] = useState<
    CreateFormQuestionRequest[]
  >([]);
  const onAddCustomQuestion = (newQuestion: CreateFormQuestionRequest) => {
    setCustomQuestions((oldArr: CreateFormQuestionRequest[]) => [
      ...oldArr,
      newQuestion,
    ]);
    toast({
      description: "Question has been successfully added.",
      status: "success",
      duration: 3000,
      isClosable: false,
      variant: "subtle",
    });
  };
  const onDeleteCustomQuestion = (
    questionToBeDeleted: CreateFormQuestionRequest,
  ) => {
    setCustomQuestions((oldArr: CreateFormQuestionRequest[]) =>
      oldArr.filter(
        (question: CreateFormQuestionRequest) =>
          question !== questionToBeDeleted,
      ),
    );
    toast({
      description: "Question has been successfully deleted.",
      status: "success",
      duration: 3000,
      isClosable: false,
      variant: "subtle",
    });
  };

  const onEditCustomQuestion = (
    oldQuestion: CreateFormQuestionRequest,
    newQuestion: CreateFormQuestionRequest,
  ) => {
    setCustomQuestions((oldArr: CreateFormQuestionRequest[]) => {
      const newArr = [...oldArr];
      for (let i = 0; i < newArr.length; i += 1) {
        if (newArr[i] === oldQuestion) {
          newArr[i] = newQuestion;
          break;
        }
      }
      return newArr;
    });

    toast({
      description: "Question has been successfully edited.",
      status: "success",
      duration: 3000,
      isClosable: false,
      variant: "subtle",
    });
  };

  // The edit-camp route will have an id to identify the camp currently in draft state
  const { id: editCampId } = useParams<{ id: string }>();
  const [isLoadedCampData, setIsLoadedCampData] = useState<boolean>(false);

  // This useEffect fetches the current state of the draft camp if we are editing camp
  useEffect(() => {
    const setInitialEditState = async () => {
      // retrieve the current state of the camp to edit
      const editCamp = await CampsAPIClient.getCampById(editCampId);

      if (editCamp.id) {
        // Schedule Sessions need the data in a certain format. We convert the array of dates stored in the backend
        // to this array of CreateCampSessions so that the sessions can be viewed/edited/deleted
        const currentCampSessions: CreateCampSession[] = editCamp.campSessions.map(
          (cs) => {
            const dates = cs.dates
              .map((date) => new Date(date))
              .sort((a, b) => a.getTime() - b.getTime());
            const currentWeekDays = getSelectedWeekDaysFromDates(dates);
            return {
              startDate: dates[0],
              endDate: dates[dates.length - 1],
              dates,
              selectedWeekDays: currentWeekDays,
            };
          },
        );
        setScheduledSessions(currentCampSessions);

        // We set the customQuestions to be the current questions stored on the backend so the admin
        // can view and edit the questions in the ui smoothly
        const currentFormQuestions: CreateFormQuestionRequest[] = editCamp.formQuestions.map(
          (fq) => {
            return {
              question: fq.question,
              type: fq.type,
              category: fq.category,
              required: fq.required,
              description: fq.description,
              options: fq.options,
            };
          },
        );
        setCustomQuestions(currentFormQuestions);

        // Set basic camp details
        setCampName(editCamp.name);
        setCampDescription(editCamp.description);
        setDailyCampFee(editCamp.fee);
        setStartTime(editCamp.startTime);
        setEndTime(editCamp.endTime);
        setAgeLower(editCamp.ageLower);
        setAgeUpper(editCamp.ageUpper);
        setOffersEDLP(
          editCamp.earlyDropoff.length !== 0 ||
            editCamp.latePickup.length !== 0,
        );
        setEarliestDropOffTime(editCamp.earlyDropoff);
        setLatestPickUpTime(editCamp.latePickup);
        setPriceEDLP(editCamp.pickupFee);
        setAddressLine1(editCamp.location.streetAddress1);
        setAddressLine2(editCamp.location.streetAddress2 ?? "");
        setCity(editCamp.location.city);
        setProvince(editCamp.location.province);
        setPostalCode(editCamp.location.postalCode);
        setCampImageURL(editCamp.campPhotoUrl);

        // Set camp level capacity from camp sessions
        if (editCamp.campSessions.length > 0) {
          // At the creation stage, all the sessions should have the same capacity
          setCampCapacity(editCamp.campSessions[0].capacity);
        }
        setIsLoadedCampData(true);
      } else {
        history.push(CAMPS_PAGE);
      }
    };

    // We only want to fetch the current state of the camp if we are editing a draft camp
    if (editCampId) {
      setInitialEditState();
    }
  }, [editCampId, history]);

  const createUpdateCampHelper = async (
    isPublishedCamp: boolean,
    isNewCamp: boolean,
  ): Promise<void> => {
    const campFields: CreateUpdateCampRequest = {
      active: isPublishedCamp,
      ageLower,
      ageUpper,
      campCoordinators: [],
      campCounsellors: [],
      name: campName,
      description: campDescription,
      earlyDropoff: earliestDropOffTime,
      endTime,
      latePickup: latestPickUpTime,
      location: {
        streetAddress1: addressLine1,
        streetAddress2: addressLine2,
        city,
        province,
        postalCode,
      },
      startTime,
      fee: dailyCampFee,
      pickupFee: priceEDLP,
      dropoffFee: priceEDLP,
      formQuestions: customQuestions,
      campSessions: scheduledSessions.map((campSession) => {
        return {
          dates: campSession.dates.map((date) => date.toString()),
          capacity: campCapacity,
        };
      }),
      volunteers: "",
    };

    try {
      let campResponse: CreateUpdateCampResponse;

      if (isNewCamp) {
        campResponse = await CampsAPIClient.createNewCamp(
          campFields,
          campImageURL,
        );
      } else {
        campResponse = await CampsAPIClient.editCampById(
          editCampId,
          campFields,
          true, // We want to create new sessions when editing.
          campImageURL,
        );
      }

      if (campResponse) {
        history.push(CAMPS_PAGE);
        toast({
          description: `${campResponse.name} has been succesfully ${
            isNewCamp ? "created" : "updated"
          }`,
          status: "success",
          variant: "subtle",
          duration: 3000,
        });
      } else {
        throw new Error("Unable to create or update camp");
      }
    } catch (error: unknown) {
      toast({
        description: `An error occurred with ${
          isNewCamp ? "creating" : "updating"
        } ${campFields.name}. Please try again.`,
        status: "error",
        variant: "subtle",
        duration: 3000,
      });
    }
  };

  const getCampCreationStepComponent = (page: CampCreationPages) => {
    switch (page) {
      case CampCreationPages.CampCreationDetailsPage:
        return (
          // Many text fields in this component use default values. When the component first loads,
          // the default value is set to the initial value of the states. To update the default values
          // after the useEffect renders the current state of the variables from the backend, we must update
          // the key of the component to refresh the default values of the fields
          <React.Fragment
            key={!editCampId || isLoadedCampData ? "loaded" : "loading"}
          >
            <CampCreationDetails
              campName={campName}
              campDescription={campDescription}
              dailyCampFee={dailyCampFee}
              startTime={startTime}
              endTime={endTime}
              ageLower={ageLower}
              ageUpper={ageUpper}
              campCapacity={campCapacity}
              offersEDLP={offersEDLP}
              earliestDropOffTime={earliestDropOffTime}
              latestPickUpTime={latestPickUpTime}
              priceEDLP={priceEDLP}
              addressLine1={addressLine1}
              addressLine2={addressLine2}
              city={city}
              province={province}
              postalCode={postalCode}
              campImageURL={campImageURL}
              handleCampName={(event: React.ChangeEvent<HTMLInputElement>) =>
                setCampName(event.target.value)
              }
              handleCampDescription={(
                event: React.ChangeEvent<HTMLTextAreaElement>,
              ) => setCampDescription(event.target.value)}
              handleDailyCampFee={(
                event: React.ChangeEvent<HTMLInputElement>,
              ) => setDailyCampFee(Number(event.target.value))}
              handleStartTime={(event: React.ChangeEvent<HTMLInputElement>) =>
                setStartTime(event.target.value)
              }
              handleEndTime={(event: React.ChangeEvent<HTMLInputElement>) =>
                setEndTime(event.target.value)
              }
              handleAgeLower={(event: React.ChangeEvent<HTMLInputElement>) =>
                setAgeLower(Number(event.target.value))
              }
              handleAgeUpper={(event: React.ChangeEvent<HTMLInputElement>) =>
                setAgeUpper(Number(event.target.value))
              }
              handleCampCapacity={(
                event: React.ChangeEvent<HTMLInputElement>,
              ) => setCampCapacity(Number(event.target.value))}
              toggleEDLP={(event: React.ChangeEvent<HTMLInputElement>) => {
                // When EDLP reset, change timings to default values
                if (!offersEDLP) {
                  setEarliestDropOffTime("");
                  setLatestPickUpTime("");
                  setPriceEDLP(0);
                }
                setOffersEDLP(Boolean(event.target.checked));
              }}
              handleEarliestDropOffTime={(
                event: React.ChangeEvent<HTMLInputElement>,
              ) => setEarliestDropOffTime(event.target.value)}
              handleLatestPickUpTime={(
                event: React.ChangeEvent<HTMLInputElement>,
              ) => setLatestPickUpTime(event.target.value)}
              handlePriceEDLP={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPriceEDLP(Number(event.target.value))
              }
              handleAddressLine1={(
                event: React.ChangeEvent<HTMLInputElement>,
              ) => setAddressLine1(event.target.value)}
              handleAddressLine2={(
                event: React.ChangeEvent<HTMLInputElement>,
              ) => setAddressLine2(event.target.value)}
              handleCity={(event: React.ChangeEvent<HTMLInputElement>) =>
                setCity(event.target.value)
              }
              handleProvince={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setProvince(event.target.value)
              }
              handlePostalCode={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPostalCode(event.target.value)
              }
              setCampImageURL={setCampImageURL}
              showErrors={showCreationErrors}
              startTimeBeforeEndTime={startTimeBeforeEndTime}
              earlyDropoffTimeBeforeLatePickupTime={
                earlyDropoffTimeBeforeLatePickupTime
              }
              earlyDropoffTimeBeforeStartTime={earlyDropoffTimeBeforeStartTime}
              endTimeBeforeLatePickupTime={endTimeBeforeLatePickupTime}
            />
          </React.Fragment>
        );
      case CampCreationPages.ScheduleSessionsPage:
        return (
          <ScheduleSessions
            campTitle={`${campName} @${startTime} - ${endTime}`}
            scheduledSessions={scheduledSessions}
            setScheduledSessions={setScheduledSessions}
            showScheduleSessionCardError={showScheduleSessionCardError}
          />
        );
      case CampCreationPages.RegistrationFormPage:
        return (
          <RegistrationForm
            formTemplateQuestions={
              formTemplate ? formTemplate.formQuestions : []
            }
            customQuestions={customQuestions}
            onAddCustomQuestion={onAddCustomQuestion}
            onDeleteCustomQuestion={onDeleteCustomQuestion}
            onEditCustomQuestion={onEditCustomQuestion}
            setVisitedRegistrationPage={setVisitedRegistrationPage}
            campOffersEDLP={offersEDLP}
          />
        );
      default:
        throw new Error("unexpected camp creation page");
    }
  };

  const handleStepNavigation = (stepsToMove: number) => {
    const invalidScheduleCard =
      !scheduledSessions.every((session) => session.dates.length !== 0) &&
      stepsToMove > 0 &&
      currentPage === CampCreationPages.ScheduleSessionsPage;
    if (invalidScheduleCard) {
      setShowScheduleSessionCardError(invalidScheduleCard);
      return;
    }

    const desiredStep = currentPage + stepsToMove;
    if (CampCreationPages[desiredStep]) {
      setCurrentPage(currentPage + stepsToMove);
    }
  };

  return (
    <VStack w="100vw" h="calc(100vh - 75px)">
      <CampCreationNavStepper
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isCampDetailsFilled={isCampDetailsFilled}
        isScheduleSessionsFilled={isScheduleSessionsFilled}
        isRegistrationFormFilled={isRegistrationFormFilled}
      />
      <Box
        w="100%"
        flex="1"
        mt={[0, "0 !important"]}
        pb={20}
        overflowX="hidden"
      >
        {getCampCreationStepComponent(currentPage)}
      </Box>
      <CampCreationFooter
        currentStep={currentPage}
        isCurrentStepCompleted={isCurrentStepCompleted(currentPage)}
        handleStepNavigation={handleStepNavigation}
        createUpdateCamp={createUpdateCampHelper}
        isEditingCamp={editCampId !== undefined}
        setShowCreationErrors={setShowCreationErrors}
      />
    </VStack>
  );
};

export default CampCreationPage;
