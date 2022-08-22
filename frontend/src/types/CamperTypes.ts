export type Camper = {
  firstName: string;
  lastName: string;
  age: number;
  allergies?: string; 
  earlyDropoff?: [Date];
  latePickup?: [Date];
  specialNeeds?: string;
  contacts: [any, any]; 
};
