import { Role } from "./AuthTypes";

export type UserRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  active: boolean;
};

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  authId: string;
  email: string;
  role: Role;
  active: boolean;
};

export type UserSelectOption = {
  label: string;
  email: string;
  value: string;
};
