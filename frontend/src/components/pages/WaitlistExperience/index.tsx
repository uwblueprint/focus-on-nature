import React, { useState } from "react";
import WaitlistConfirmationPage from "./ConfirmationPage";
import WaitlistPersonalInfoPage from "./PersonalInfo";
import WaitlistFooter from "./WaitlistFooter";

const WaitlistExperiencePage = (): React.ReactElement => {
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);

  // Temp variables for personal info page
  const [isPersonalInfoChecked, setIsPersonalInfoChecked] = useState(false);

  const isPersonalInfoComplete = isPersonalInfoChecked;

  const submitHandler = () => {
    if (!isPersonalInfoComplete) {
      alert("PLACEHOLDER - personal info step not completed");
    } else {
      setIsConfirmationStep(true);
    }
  };
  return (
    <>
      {isConfirmationStep ? (
        <WaitlistConfirmationPage />
      ) : (
        <WaitlistPersonalInfoPage
          isChecked={isPersonalInfoChecked}
          toggleChecked={() => setIsPersonalInfoChecked(!isPersonalInfoChecked)}
        />
      )}
      {!isConfirmationStep && <WaitlistFooter submitHandler={submitHandler} />}
    </>
  );
};

export default WaitlistExperiencePage;
