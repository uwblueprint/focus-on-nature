import React, { useState, useEffect } from "react";
import { Box, VStack, useToast } from "@chakra-ui/react";
import ScheduleSessions from "./ScheduleSessions";
import RegistrationForm from "./RegistrationForm";
import CampCreationPages from "./CampCreationPages";
import CampCreationNavStepper from "./CampCreationNavStepper";
import { FormTemplate } from "../../../types/AdminTypes";
import AdminAPIClient from "../../../APIClients/AdminAPIClient";
import {
  CreateFormQuestion,
  CreateCampSession,
} from "../../../types/CampsTypes";
import CampCreationDetails from "./CampDetails";

const CampCreationPage = (): React.ReactElement => {
  /* eslint-disable */
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
  const [addressLine1, setAddresLine1] = useState<string>("");
  const [addressLine2, setAddresLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [province, setProvince] = useState<string>("-");
  const [postalCode, setPostalCode] = useState<string>("");
  const [campImageURL, setCampImageURL] = useState<string>("");

  const [scheduledSessions, setScheduledSessions] = React.useState<
    CreateCampSession[]
  >([]);

  const [visitedRegistrationPage, setVisitedRegistrationPage] = useState(false);

  // Variables to determine whether or not all required fields have been filled out.
  // NOTE: This will depend on what type of state a page requires, i.e. determining
  // if a checkbox is checked is different than determining if an input field is filled.
  let isCampDetailsFilled = false
    
  if(campName && 
    campDescription &&
    dailyCampFee &&
    startTime &&
    endTime &&
    ageLower &&
    ageUpper &&
    (offersEDLP?
      earliestDropOffTime &&
      latestPickUpTime &&
      priceEDLP
      :
      true
    ) &&
    campCapacity &&
    addressLine1 &&
    city &&
    province &&
    province &&
    postalCode
    )
    isCampDetailsFilled = true
  else
    isCampDetailsFilled = false

  const isScheduleSessionsFilled = scheduledSessions.length != 0;
  const isRegistrationFormFilled = visitedRegistrationPage;

  // State of what page to display.
  const [currentPage, setCurrentPage] = useState<CampCreationPages>(
    CampCreationPages.CampCreationDetailsPage,
  );
  /* eslint-enable */

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

  const toast = useToast();

  const [customQuestions, setCustomQuestions] = useState<CreateFormQuestion[]>(
    [],
  );
  const onAddCustomQuestion = (newQuestion: CreateFormQuestion) => {
    setCustomQuestions((oldArr: CreateFormQuestion[]) => [
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
  const onDeleteCustomQuestion = (questionToBeDeleted: CreateFormQuestion) => {
    setCustomQuestions((oldArr: CreateFormQuestion[]) =>
      oldArr.filter(
        (question: CreateFormQuestion) => question !== questionToBeDeleted,
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
    oldQuestion: CreateFormQuestion,
    newQuestion: CreateFormQuestion,
  ) => {
    setCustomQuestions((oldArr: CreateFormQuestion[]) => {
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

  const getCampCreationStepComponent = (page: CampCreationPages) => {
    switch (page) {
      case CampCreationPages.CampCreationDetailsPage:
        return (
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
            handleDailyCampFee={(event: React.ChangeEvent<HTMLInputElement>) =>
              setDailyCampFee(Number(event.target.value))
            }
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
            handleCampCapacity={(event: React.ChangeEvent<HTMLInputElement>) =>
              setCampCapacity(Number(event.target.value))
            }
            toggleEDLP={(event: React.ChangeEvent<HTMLInputElement>) =>
              setOffersEDLP(Boolean(event.target.checked))
            }
            handleEarliestDropOffTime={(
              event: React.ChangeEvent<HTMLInputElement>,
            ) => setEarliestDropOffTime(event.target.value)}
            handleLatestPickUpTime={(
              event: React.ChangeEvent<HTMLInputElement>,
            ) => setLatestPickUpTime(event.target.value)}
            handlePriceEDLP={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPriceEDLP(Number(event.target.value))
            }
            handleAddressLine1={(event: React.ChangeEvent<HTMLInputElement>) =>
              setAddresLine1(event.target.value)
            }
            handleAddressLine2={(event: React.ChangeEvent<HTMLInputElement>) =>
              setAddresLine2(event.target.value)
            }
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
          />
        );
      case CampCreationPages.ScheduleSessionsPage:
        return (
          <ScheduleSessions
            campTitle="Waterloo Photography Camp 2022 @7:00 AM - 3:00PM"
            scheduledSessions={scheduledSessions}
            setScheduledSessions={setScheduledSessions}
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
          />
        );
      default:
        throw new Error("unexpected camp creation page");
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

      <Box w="100%" flex="1" mt={[0, "0 !important"]}>
        {getCampCreationStepComponent(currentPage)}
      </Box>
    </VStack>
  );
};

export default CampCreationPage;
