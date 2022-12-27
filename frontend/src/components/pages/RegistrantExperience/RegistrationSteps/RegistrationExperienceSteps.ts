enum RegistrantExperienceSteps {
  PersonalInfoPage,
  AdditionalInfoPage,
  WaiverPage,
  ReviewRegistrationPage,
}

export type StepperPageDetails = {
  pageName: string;
  nextPageName: string;
  pageNumber: number;
  progress: number;
  isFilled: boolean;
  isAvailable: boolean;
  icon: JSX.Element;
};

// Numeric enums have reverse mapping, need to divide by 2
export const REGISTRATION_NUM_STEPS =
  Object.keys(RegistrantExperienceSteps).length / 2;

export default RegistrantExperienceSteps;
