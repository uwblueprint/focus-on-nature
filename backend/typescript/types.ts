export type Role = "User" | "Admin";

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
};

export type CamperDTO = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  parentName: string;
  contactEmail: string;
  contactNumber: string;
  camps: [string];
  hasCamera: boolean;
  hasLaptop: boolean;
  allergies: string;
  additionalDetails: string;
  dropOffType: DropOffType;
  registrationDate: Date;
  hasPaid: boolean;
  charge_id: number;
}

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

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

export type SignUpMethod = "PASSWORD" | "GOOGLE";
