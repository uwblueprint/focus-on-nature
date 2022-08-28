import { BEARER_TOKEN } from "../constants/AuthConstants";
import baseAPIClient from "./BaseAPIClient";
import { UserRequest, UserResponse } from "../types/UserTypes";

const getAllUsers = async (): Promise<Array<UserResponse>> => {
  try {
    const { data } = await baseAPIClient.get(`/users`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as UserResponse[];
  }
};

const updateUserById = async (
  id: string,
  userData: UserRequest,
): Promise<boolean> => {
  try {
    const { data } = await baseAPIClient.put(`/users/${id}`, userData, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  getAllUsers,
  updateUserById,
};
