import { Role } from "./AuthTypes";

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  authId: string;
  email: string;
  role: Role;
  active: boolean;
};
