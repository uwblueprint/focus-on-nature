import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import CampDetails from "./CampDetails";
import ScheduleSessions from "./ScheduleSessions";
import RegistrationForm from "./RegistrationForm";
import Stepper from "./StepperNavigation/index";
import { CampCreationPages } from "./CampCreationPages";

const CampCreationPage = (): React.ReactElement => {
  /* eslint-disable */
  // All response state from the three page components.
  const [campDetailsDummyOne, setCampDetailsDummyOne] = useState(false);
  const [campDetailsDummyTwo, setCampDetailsDummyTwo] = useState(false);
  const [campDetailsDummyThree, setCampDetailsDummyThree] = useState("");
  const [scheduleSessionsDummyOne, setScheduleSessionsDummyOne] = useState(false);
  const [scheduleSessionsDummyTwo, setScheduleSessionsDummyTwo] = useState(false);
  const [registrationFormDummyOne, setRegistrationFormDummyOne] = useState(false);
  const [registrationFormDummyTwo, setRegistrationFormDummyTwo] = useState(false);

  // Variables to determine whether or not all required fields have been filled out.
  // NOTE: This will depend on what type of state a page requires, i.e. determining
  // if a checkbox is checked is different than determining if an input field is filled.
  const isCampDetailsFilled = campDetailsDummyOne && campDetailsDummyTwo && campDetailsDummyThree !== "";
  const isScheduleSessionsFilled = scheduleSessionsDummyOne && scheduleSessionsDummyTwo;
  const isRegistrationFormFilled = registrationFormDummyOne && registrationFormDummyTwo;

  // State of what page to display.
  const [currentPage, setCurrentPage] = useState<CampCreationPages>(CampCreationPages.CampCreationDetailsPage);
  /* eslint-enable */

  return (
    <>
      <Stepper
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isCampDetailsFilled={isCampDetailsFilled}
        isScheduleSessionsFilled={isScheduleSessionsFilled}
        isRegistrationFormFilled={isRegistrationFormFilled}
      />
      <Box m={20}>
        {currentPage === CampCreationPages.CampCreationDetailsPage && (
          <CampDetails
            campDetailsDummyOne={campDetailsDummyOne}
            campDetailsDummyTwo={campDetailsDummyTwo}
            campDetailsDummyThree={campDetailsDummyThree}
            toggleCampDetailsDummyOne={() =>
              setCampDetailsDummyOne(!campDetailsDummyOne)
            }
            toggleCampDetailsDummyTwo={() =>
              setCampDetailsDummyTwo(!campDetailsDummyTwo)
            }
            handleCampDetailsDummyThree={(event) =>
              setCampDetailsDummyThree(event.target.value)
            }
          />
        )}
        {currentPage === CampCreationPages.ScheduleSessionsPage && (
          <ScheduleSessions
            scheduleSessionsDummyOne={scheduleSessionsDummyOne}
            scheduleSessionsDummyTwo={scheduleSessionsDummyTwo}
            toggleScheduleSessionsDummyOne={() =>
              setScheduleSessionsDummyOne(!scheduleSessionsDummyOne)
            }
            toggleScheduleSessionsDummyTwo={() =>
              setScheduleSessionsDummyTwo(!scheduleSessionsDummyTwo)
            }
          />
        )}
        {currentPage === CampCreationPages.RegistrationFormPage && (
          <RegistrationForm
            registrationFormDummyOne={registrationFormDummyOne}
            registrationFormDummyTwo={registrationFormDummyTwo}
            toggleRegistrationFormDummyOne={() =>
              setRegistrationFormDummyOne(!registrationFormDummyOne)
            }
            toggleRegistrationFormDummyTwo={() =>
              setRegistrationFormDummyTwo(!registrationFormDummyTwo)
            }
          />
        )}
      </Box>
    </>
  );
};

export default CampCreationPage;
