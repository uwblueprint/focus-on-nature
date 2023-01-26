import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { CreateWaitlistedCamperDTO } from "../../../types/CamperTypes";
import { CampResponse, CampSession } from "../../../types/CampsTypes";
import EmptyNavBar from "../../common/EmptyNavBar";

import WaitlistConfirmationPage from "./ConfirmationPage";
import WaitlistPersonalInfoPage from "./PersonalInfo";
import { checkPersonalInfoFilled } from "./PersonalInfo/personalInfoReducer";
import WaitListExperienceSteps from "./WaitlistExperienceSteps";
import WaitlistFooter from "./WaitlistFooter";

interface WaitlistExperiencePageProps {
  camp: CampResponse;
  selectedCampSessions: CampSession[];
  onClickBack: () => void;
}

const waitListNextStepTxtMap = new Map();
waitListNextStepTxtMap.set(WaitListExperienceSteps.PersonalInfoPage, "Submit");

const WaitlistExperiencePage = ({
  camp,
  selectedCampSessions,
  onClickBack,
}: WaitlistExperiencePageProps): React.ReactElement => {
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const [currentStep, setCurrentStep] = useState<WaitListExperienceSteps>(
    WaitListExperienceSteps.PersonalInfoPage,
  );
  const [campers, setCampers] = useState<CreateWaitlistedCamperDTO[]>([
    {
      firstName: "",
      lastName: "",
      age: NaN,
      contactEmail: "",
      contactFirstName: "",
      contactLastName: "",
      contactNumber: "",
    },
  ]);

  if (!camp)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  const handleStepNavigation = (stepsToMove: number) => {
    const desiredStep = currentStep + stepsToMove;
    if (WaitListExperienceSteps[desiredStep]) {
      setCurrentStep(currentStep + stepsToMove);
    } else if (desiredStep < 0) {
      onClickBack();
    }
  };

  const isCurrentStepCompleted = (step: WaitListExperienceSteps) => {
    switch (step) {
      case WaitListExperienceSteps.PersonalInfoPage:
        return checkPersonalInfoFilled(campers, camp);
      default:
        return false;
    }
  };

  const getCurrentRegistrantStepComponent = (step: WaitListExperienceSteps) => {
    switch (step) {
      case WaitListExperienceSteps.PersonalInfoPage:
        return (
          <WaitlistPersonalInfoPage
            nextBtnRef={nextBtnRef}
            campers={campers}
            camp={camp}
            setCampers={setCampers}
          />
        );
      case WaitListExperienceSteps.ConfirmationPage:
        return (
          <WaitlistConfirmationPage
            campSessions={selectedCampSessions}
            campers={campers}
            campName={camp.name}
          />
        );
      default:
        throw new Error("unexpected page");
    }
  };

  return (
    <Box>
      <EmptyNavBar />
      <Flex
        direction="column"
        pt={{ sm: "60px", md: "60px", lg: "72px" }}
        pb={{ sm: "170px", md: "108px", lg: "144px" }}
        justifyContent="flex-start"
      >
        <Box>{getCurrentRegistrantStepComponent(currentStep)}</Box>
        {currentStep !== WaitListExperienceSteps.ConfirmationPage && (
          <WaitlistFooter
            nextBtnRef={nextBtnRef}
            isCurrentStepCompleted={isCurrentStepCompleted(currentStep)}
            registrationLoading={false}
            handleStepNavigation={handleStepNavigation}
          />
        )}
      </Flex>
    </Box>
  );
};

export default WaitlistExperiencePage;
