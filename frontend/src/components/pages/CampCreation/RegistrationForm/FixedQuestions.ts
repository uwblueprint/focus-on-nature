import { FormQuestion } from "../../../../types/CampsTypes";

const fixedCamperInfoQuestions: Array<FormQuestion> = [
    {
        type: "Text",
        question: "Camper Name",
        required: true,
        category: "PersonalInfo",
        id: "NONE"
    },
    {
        type: "MultipleChoice",
        question: "Camper Age",
        required: true,
        category: "PersonalInfo",
        id: "NONE"
    },
    {
        type: "Text",
        question: "Allergies",
        required: true,
        category: "PersonalInfo",
        id: "NONE"
    },
    {
        type: "Text",
        question: "Special Needs",
        required: true,
        category: "PersonalInfo",
        id: "NONE"
    },
    {
        type: "Multiselect",
        question: "Please indicate if your child requires early dropoff or late pickup",
        required: true,
        category: "PersonalInfo",
        id: "NONE"
    },
];

export default {
    fixedCamperInfoQuestions
};