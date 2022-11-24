enum RegistrantExperienceSteps {
  PersonalInfoPage,
  AdditionalInfoPage,
  WaiverPage,
  ReviewRegistrationPage,
}

// Numeric enums have reverse mapping, need to divide by 2
export const REGISTRATION_NUM_STEPS =
  Object.keys(RegistrantExperienceSteps).length / 2;

export default RegistrantExperienceSteps;
