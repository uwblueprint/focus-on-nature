import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive, validateDate } from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
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
  if (!validatePrimitive(req.body.age, "integer")) {
    return res.status(400).send(getApiValidationError("age", "integer"));
  }
  if (!validatePrimitive(req.body.contactName, "string")) {
    return res.status(400).send(getApiValidationError("contactName", "string"));
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
  if (!validatePrimitive(req.body.camp, "string")) {
    return res.status(400).send(getApiValidationError("camp", "string"));
  }
  if (!validatePrimitive(req.body.hasCamera, "boolean")) {
    return res.status(400).send(getApiValidationError("hasCamera", "boolean"));
  }
  if (!validatePrimitive(req.body.hasLaptop, "boolean")) {
    return res.status(400).send(getApiValidationError("hasLaptop", "boolean"));
  }
  if (req.body.allergies && !validatePrimitive(req.body.allergies, "string")) {
    return res.status(400).send(getApiValidationError("allergies", "string"));
  }
  if (
    req.body.additionalDetails &&
    !validatePrimitive(req.body.additionalDetails, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("additionalDetails", "string"));
  }
  if (
    req.body.dropOffType &&
    !validatePrimitive(req.body.dropOffType, "string")
  ) {
    return res.status(400).send(getApiValidationError("dropOffType", "string"));
  }
  if (!validateDate(req.body.registrationDate)) {
    return res
      .status(400)
      .send(getApiValidationError("registrationDate", "Date string"));
  }
  if (!validatePrimitive(req.body.hasPaid, "boolean")) {
    return res.status(400).send(getApiValidationError("hasPaid", "boolean"));
  }
  if (!validatePrimitive(req.body.chargeId, "integer")) {
    return res.status(400).send(getApiValidationError("chargeId", "integer"));
  }

  return next();
};
