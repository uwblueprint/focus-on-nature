import { Role } from "./AuthTypes";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  authId: string;
  email: string;
  role: Role;
  active: boolean;
};
