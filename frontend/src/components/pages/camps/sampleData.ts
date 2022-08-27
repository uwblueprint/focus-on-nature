import { Camper } from "../../../types/CamperTypes";

// TODO - this is dependant on the selected camp session
export const campSessionCapacity = 4;
// -----------------------------------------------------

export const waitlistedCampersTest = [
  {
    firstName: "Joe",
    lastName: "Smith",
    age: 12,
    contactName: "Mom Smith",
    contactEmail: "mom@domain.com",
    contactNumber: "000-123-4567",
    status: "RegistrationFormSent",
    linkExpiry: "2022-07-28T19:12:31.783+00:00",
  },
  {
    firstName: "Bob",
    lastName: "Bobby",
    age: 13,
    contactName: "Mom Bob",
    contactEmail: "bobmom@domain.com",
    contactNumber: "000-123-4568",
    status: "NotRegistered",
    linkExpiry: "2022-08-19T19:12:31.783+00:00",
  },
  {
    firstName: "Joe",
    lastName: "Bob",
    age: 12,
    contactName: "Mom JoeBob",
    contactEmail: "joebobmom@domain.com",
    contactNumber: "000-123-4569",
    status: "Registered",
  },
  {
    firstName: "Dan",
    lastName: "Smith",
    age: 11,
    contactName: "Mom Dan",
    contactEmail: "danmom@domain.com",
    contactNumber: "000-123-4560",
    status: "RegistrationFormSent",
    linkExpiry: "2022-08-28T19:12:31.783+00:00",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    age: 12,
    contactName: "Mom Jane",
    contactEmail: "janemom@domain.com",
    contactNumber: "000-123-4561",
    status: "RegistrationFormSent",
    linkExpiry: "2022-08-28T19:12:31.783+00:00",
  },
  {
    firstName: "Ella",
    lastName: "Smith",
    age: 12,
    contactName: "Mom Ella",
    contactEmail: "ellamom@domain.com",
    contactNumber: "000-123-4562",
    status: "RegistrationFormSent",
    linkExpiry: "2022-08-28T19:12:31.783+00:00",
  },
  {
    firstName: "Sarah",
    lastName: "Smith",
    age: 12,
    contactName: "Mom Sarah",
    contactEmail: "sarahmom@domain.com",
    contactNumber: "000-123-4565",
    status: "RegistrationFormSent",
    linkExpiry: "2022-08-28T19:12:31.783+00:00",
  },
];

export const emptyCampersTest: Camper[] = [];

export const campersTest: Camper[] = [
  {
    firstName: "Joe",
    lastName: "Bob",
    age: 12,
    allergies: "peanuts",
    earlyDropoff: [new Date()],
    latePickup: [new Date()],
    specialNeeds: "",
    contacts: [
      {
        firstName: "Mom",
        lastName: "Bob",
        email: "momBob@gmail.com",
        phoneNumber: "123-456-7890",
        relationshipToCamper: "parent",
      },
      {
        firstName: "Dad",
        lastName: "Bob",
        email: "dadBob@gmail.com",
        phoneNumber: "123-456-7890",
        relationshipToCamper: "parent ",
      },
    ],
  },
  {
    firstName: "Fred",
    lastName: "McAlister",
    age: 10,
    allergies: "",
    latePickup: [new Date()],
    specialNeeds: "N/A",
    contacts: [
      {
        firstName: "Mom",
        lastName: "Fred",
        email: "momFred@gmail.com",
        phoneNumber: "123-456-7890",
        relationshipToCamper: "parent",
      },
      {
        firstName: "Dad",
        lastName: "Fred",
        email: "dadFred@gmail.com",
        phoneNumber: "123-456-7890",
        relationshipToCamper: "parent",
      },
    ],
  },
  {
    firstName: "Josh",
    lastName: "Tod",
    age: 11,
    allergies: "",
    earlyDropoff: [new Date()],
    specialNeeds: "",
    contacts: [
      {
        firstName: "Mom",
        lastName: "Tod",
        email: "momTod@gmail.com",
        phoneNumber: "123-456-7890",
        relationshipToCamper: "parent",
      },
      {
        firstName: "Dad",
        lastName: "Toc",
        email: "dadTod@gmail.com",
        phoneNumber: "123-456-7890",
        relationshipToCamper: "parent",
      },
    ],
  },
  {
    firstName: "Felicia",
    lastName: "Rose",
    age: 9,
    allergies: "pollen",
    earlyDropoff: [new Date()],
    latePickup: [new Date()],
    specialNeeds: "",
    contacts: [
      {
        firstName: "Mom",
        lastName: "Rose",
        email: "momRose@gmail.com",
        phoneNumber: "123-456-7890",
        relationshipToCamper: "parent",
      },
      {
        firstName: "Dad",
        lastName: "Rose",
        email: "dadRose@gmail.com",
        phoneNumber: "123-456-7890",
        relationshipToCamper: "parent",
      },
    ],
  },
];