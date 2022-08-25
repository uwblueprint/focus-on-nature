export enum Filter {
  ALL = "All",
  EARLY_DROP_OFF = "Early_Drop_Off",
  LATE_PICK_UP = "Late_Pick_Up",
  HAS_ALLERGIES = "Has_Allergies",
  ADDITIONAL_NEEDS = "Additional_Needs",
}

export const filterOptions = [
  Filter.ALL,
  Filter.EARLY_DROP_OFF,
  Filter.LATE_PICK_UP,
  Filter.HAS_ALLERGIES,
  Filter.ADDITIONAL_NEEDS,
];
