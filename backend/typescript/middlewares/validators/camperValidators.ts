import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive, validateDate } from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const updateCamperDtoValidator = async (
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
  if (req.body.age && !validatePrimitive(req.body.age, "integer")) {
    return res.status(400).send(getApiValidationError("age", "integer"));
  }
  if (
    req.body.parentName &&
    !validatePrimitive(req.body.parentName, "string")
  ) {
    return res.status(400).send(getApiValidationError("parentName", "string"));
  }
  if (
    req.body.contactEmail &&
    !validatePrimitive(req.body.contactEmail, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("contactEmail", "string"));
  }
  if (
    req.body.contactNumber &&
    !validatePrimitive(req.body.contactNumber, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("contactNumber", "string"));
  }
  if (req.body.camp && !validatePrimitive(req.body.camp, "string")) {
    return res.status(400).send(getApiValidationError("camp", "string"));
  }
  if (req.body.hasCamera && !validatePrimitive(req.body.hasCamera, "boolean")) {
    return res.status(400).send(getApiValidationError("hasCamera", "boolean"));
  }
  if (req.body.hasLaptop && !validatePrimitive(req.body.hasLaptop, "boolean")) {
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
  if (req.body.registrationDate && !validateDate(req.body.registrationDate)) {
    return res
      .status(400)
      .send(getApiValidationError("registrationDate", "Date string"));
  }
  if (req.body.hasPaid && !validatePrimitive(req.body.hasPaid, "boolean")) {
    return res.status(400).send(getApiValidationError("hasPaid", "boolean"));
  }
  if (req.body.chargeId && !validatePrimitive(req.body.chargeId, "integer")) {
    return res.status(400).send(getApiValidationError("chargeId", "integer"));
  }
  return next();
};
