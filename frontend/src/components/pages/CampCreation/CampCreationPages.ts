enum CampCreationPages {
  CampCreationDetailsPage,
  ScheduleSessionsPage,
  RegistrationFormPage,
}

// Numeric enums have reverse mapping, need to divide by 2
export const CAMP_CREATION_NUM_STEPS =
  Object.keys(CampCreationPages).length / 2;

export default CampCreationPages;
