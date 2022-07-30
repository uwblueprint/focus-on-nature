import { Role } from "./AuthTypes";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  active: boolean;
};
