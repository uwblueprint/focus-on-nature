import * as EmailValidator from 'email-validator';

export interface IPersonalInfoReducer<A, B> {
  updateCamper(campIndex: number, data: A, field: string): void;
  updateContact(camperIndex: number, data: B, field: string): void;
  deleteCamper(camperIndex: number): void;
  addCamper(): void;
}

export const checkFirstName = (firstName: string): boolean => {
  return !!firstName;
};

export const checkLastName = (lastName: string): boolean => {
  return !!lastName;
};

export const checkAge = (
  age: number,
  campUpper: number,
  campLower: number,
): boolean => {
  return !!age && age >= campLower && age <= campUpper;
};

export const checkEmail = (email: string): boolean => {
  const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\\.[a-z]{2,3}');
  return emailRegex.test(email);
};

export const verifyEmail = (email:string): Promise<boolean> => {
  return Promise.resolve(EmailValidator.validate(email));
};

export const checkPhoneNumber = (phoneNumber: string): boolean => {
  return !!phoneNumber;
};

export const checkRelationToCamper = (relation: string): boolean => {
  return !!relation;
};
