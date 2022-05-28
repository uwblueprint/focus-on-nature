import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validatePrimitive,
  validateArray,
  duplicatesInArray,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const createUserDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.firstName, "string")) {
    return res.status(400).send(getApiValidationError("firstName", "string"));
  }
  if (!validatePrimitive(req.body.lastName, "string")) {
    return res.status(400).send(getApiValidationError("lastName", "string"));
  }
  if (!validatePrimitive(req.body.email, "string")) {
    return res.status(400).send(getApiValidationError("email", "string"));
  }
  if (!validatePrimitive(req.body.role, "string")) {
    return res.status(400).send(getApiValidationError("role", "string"));
  }
  if (!validatePrimitive(req.body.active, "boolean")) {
    return res.status(400).send(getApiValidationError("active", "boolean"));
  }

  return next();
};

export const updateUserDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.firstName && !validatePrimitive(req.body.firstName, "string")) {
    return res.status(400).send(getApiValidationError("firstName", "string"));
  }
  if (req.body.lastName && !validatePrimitive(req.body.lastName, "string")) {
    return res.status(400).send(getApiValidationError("lastName", "string"));
  }
  if (req.body.email && !validatePrimitive(req.body.email, "string")) {
    return res.status(400).send(getApiValidationError("email", "string"));
  }
  if (req.body.role && !validatePrimitive(req.body.role, "string")) {
    return res.status(400).send(getApiValidationError("role", "string"));
  }
  if (req.body.active && !validatePrimitive(req.body.active, "boolean")) {
    return res.status(400).send(getApiValidationError("active", "boolean"));
  }
  if (
    req.body.role === "CampCoordinator" &&
    req.body.campSessions &&
    !validateArray(req.body.campSessions, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("campSessions", "string", true));
  }
  if (
    req.body.campSessions &&
    duplicatesInArray(req.body.campSessions) === true
  ) {
    return res.status(400).send("All camp sessions should be unique.");
  }
  return next();
};
