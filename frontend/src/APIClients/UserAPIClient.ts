import { getBearerToken } from "../constants/AuthConstants";
import baseAPIClient from "./BaseAPIClient";
import { UserRequest, UserResponse } from "../types/UserTypes";

const getAllUsers = async (): Promise<Array<UserResponse>> => {
  try {
    const { data } = await baseAPIClient.get(`/users`, {
      headers: { Authorization: getBearerToken() },
    });
    return data;
  } catch (error) {
    return [];
  }
};

const updateUserById = async (
  id: string,
  userData: UserRequest,
): Promise<boolean> => {
  try {
    await baseAPIClient.put(`/users/${id}`, userData, {
      headers: { Authorization: getBearerToken() },
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
