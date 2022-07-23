import { BEARER_TOKEN } from "../constants/AuthConstants";
import baseAPIClient from "./BaseAPIClient";
import { UserResponse } from "../types/UserTypes";

const getUsers = async (): Promise<Array<UserResponse>> => {
  try {
    const { data } = await baseAPIClient.get(`/users`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Array<UserResponse>;
  }
};

export default { getUsers };
