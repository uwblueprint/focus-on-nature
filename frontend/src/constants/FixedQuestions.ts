import { FormQuestion } from "../types/CampsTypes";

const PERSONAL_INFO = "PersonalInfo";
const EMERGENCY_CONTACT = "EmergencyContact";
export const EDLP_CAMPER_INFO_QUESTION =
  "Please indicate if your child requires early dropoff and/or late pickup";

export const fixedCamperInfoQuestions: Array<FormQuestion> = [
  {
    type: "Text",
    question: "Camper First Name",
    required: true,
    category: PERSONAL_INFO,
    id: "NONE",
  },
  {
    type: "Text",
    question: "Camper Last Name",
    required: true,
    category: PERSONAL_INFO,
    id: "NONE",
  },
  {
    type: "Text",
    question: "Camper Age (at time of camp)",
    required: true,
    category: PERSONAL_INFO,
    id: "NONE",
  },
  {
    type: "Text",
    question: "Does your child have any allergies? (If no, please leave blank)",
    required: false,
    category: PERSONAL_INFO,
    id: "NONE",
  },
  {
    type: "Text",
    question:
      "Please indicate if your child requires any additional accomodations (if not, please leave blank)",
    required: false,
    category: PERSONAL_INFO,
    id: "NONE",
  },
  {
    type: "MultipleChoice",
    question: EDLP_CAMPER_INFO_QUESTION,
    required: true,
    category: PERSONAL_INFO,
    options: ["Yes", "No"],
    id: "NONE",
  },
];

export const fixedEmergencyContactQuestions: Array<FormQuestion> = [
  {
    type: "Text",
    question: "Primary Emergency Contact: First Name",
    required: true,
    category: EMERGENCY_CONTACT,
    id: "NONE",
  },
  {
    type: "Text",
    question: "Primary Emergency Contact: Last Name",
    required: true,
    category: EMERGENCY_CONTACT,
    id: "NONE",
  },
  {
    type: "Text",
    question: "Primary Emergency Contact: Phone Number",
    required: true,
    category: EMERGENCY_CONTACT,
    id: "NONE",
  },
  {
    type: "Text",
    question: "Primary Emergency Contact: Email",
    required: true,
    category: EMERGENCY_CONTACT,
    id: "NONE",
  },
  {
    type: "Text",
    question: "Secondary Emergency Contact: First Name",
    required: false,
    category: EMERGENCY_CONTACT,
    id: "NONE",
  },
  {
    type: "Text",
    question: "Secondary Emergency Contact: Last Name",
    required: false,
    category: EMERGENCY_CONTACT,
    id: "NONE",
  },
  {
    type: "Text",
    question: "Secondary Emergency Contact: Phone Number",
    required: false,
    category: EMERGENCY_CONTACT,
    id: "NONE",
  },
  {
    type: "Text",
    question: "Secondary Emergency Contact: Email",
    required: false,
    category: EMERGENCY_CONTACT,
    id: "NONE",
  },
];
