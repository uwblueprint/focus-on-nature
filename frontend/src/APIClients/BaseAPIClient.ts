import axios, { AxiosRequestConfig } from "axios";
import jwt from "jsonwebtoken";

import { DecodedJWT } from "../types/AuthTypes";

const baseAPIClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

baseAPIClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const newConfig = { ...config };

  // if access token in header has expired, auto-logout the user
  const authHeaderParts = config.headers.Authorization?.split(" ");
  if (
    authHeaderParts &&
    authHeaderParts.length >= 2 &&
    authHeaderParts[0].toLowerCase() === "bearer"
  ) {
    const decodedToken = jwt.decode(authHeaderParts[1]) as DecodedJWT;

    if (
      decodedToken &&
      (typeof decodedToken === "string" ||
        decodedToken.exp <= Math.round(new Date().getTime() / 1000))
    ) {
      localStorage.clear();
      window.location.reload();
    }
  }

  return newConfig;
});

export default baseAPIClient;
