import { Role } from "./AuthTypes";

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  active: boolean;
};
