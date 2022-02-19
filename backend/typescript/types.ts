export type Role = "Admin" | "CampLeader";

export type DropOffType = "EarlyDropOff" | "LatePickUp";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  active: boolean;
};

export type CampLeaderDTO = UserDTO & { camps: string[] };

export type CamperDTO = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  parentName: string;
  contactEmail: string;
  contactNumber: string;
  camps: string[];
  hasCamera: boolean;
  hasLaptop: boolean;
  allergies: string;
  additionalDetails: string;
  dropOffType: DropOffType;
  registrationDate: Date;
  hasPaid: boolean;
  chargeId: number;
};

export type CamperCSVInfoDTO = Omit<CamperDTO, "camps" | "id">;

export type WaitlistedCamperDTO = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  camp: string;
};

export type CreateUserDTO = Omit<UserDTO, "id">;

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type CampDTO = {
  id: string;
  abstractCamp: string;
  campers: string[];
  waitlist: string[];
  startDate: string;
  endDate: string;
  active: boolean;
};

export type AbstractCampDTO = {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  fee: number;
  camperInfo: string[];
  camps: string[];
};

export type CreateCampDTO = Omit<
  CampDTO & AbstractCampDTO,
  "id" | "abstractCamp"
>;

export type AuthDTO = Token & UserDTO;

export type Letters = "A" | "B" | "C" | "D";

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
};
