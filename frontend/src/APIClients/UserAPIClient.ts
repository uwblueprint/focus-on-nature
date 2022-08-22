import { BEARER_TOKEN } from "../constants/AuthConstants";
import baseAPIClient from "./BaseAPIClient";
import { UserResponse } from "../types/UserTypes";

const getAllUsers = async (): Promise<Array<UserResponse>> => {
  try {
    const { data } = await baseAPIClient.get(`/users`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return [];
  }
};

export default { getAllUsers };
