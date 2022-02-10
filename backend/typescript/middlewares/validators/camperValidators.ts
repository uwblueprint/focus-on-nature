import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const createCamperDtoValidator = async (
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
  if (!validatePrimitive(req.body.age, "string")) {
    return res.status(400).send(getApiValidationError("age", "string"));
  }
  if (!validatePrimitive(req.body.parentName, "string")) {
    return res.status(400).send(getApiValidationError("parentName", "string"));
  }
  if (!validatePrimitive(req.body.contactEmail, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("contactEmail", "string"));
  }
  if (!validatePrimitive(req.body.contactNumber, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("contactNumber", "string"));
  }
  if (!validatePrimitive(req.body.camps, "string")) {
    return res.status(400).send(getApiValidationError("camps", "string"));
  }
  if (!validatePrimitive(req.body.hasCamera, "string")) {
    return res.status(400).send(getApiValidationError("hasCamera", "string"));
  }
  if (!validatePrimitive(req.body.hasLaptop, "string")) {
    return res.status(400).send(getApiValidationError("hasLaptop", "string"));
  }
  if (!validatePrimitive(req.body.allergies, "string")) {
    return res.status(400).send(getApiValidationError("allergies", "string"));
  }
  if (!validatePrimitive(req.body.additionalDetails, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("additionalDetails", "string"));
  }
  if (!validatePrimitive(req.body.dropOffType, "string")) {
    return res.status(400).send(getApiValidationError("dropOffType", "string"));
  }
  if (!validatePrimitive(req.body.registrationDate, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("registrationDate", "string"));
  }
  if (!validatePrimitive(req.body.hasPaid, "string")) {
    return res.status(400).send(getApiValidationError("hasPaid", "string"));
  }
  if (!validatePrimitive(req.body.chargeId, "string")) {
    return res.status(400).send(getApiValidationError("chargeId", "string"));
  }

  return next();
};

export const updateUserDtoValidator = async (
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
  return next();
};
