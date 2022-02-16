import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

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
  if (req.body.age && !validatePrimitive(req.body.age, "string")) {
    return res.status(400).send(getApiValidationError("age", "string"));
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
  if (req.body.hasCamera && !validatePrimitive(req.body.hasCamera, "string")) {
    return res.status(400).send(getApiValidationError("hasCamera", "string"));
  }
  if (req.body.hasLaptop && !validatePrimitive(req.body.hasLaptop, "string")) {
    return res.status(400).send(getApiValidationError("hasLaptop", "string"));
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
  if (
    req.body.registrationDate &&
    !validatePrimitive(req.body.registrationDate, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("registrationDate", "string"));
  }
  if (req.body.hasPaid && !validatePrimitive(req.body.hasPaid, "string")) {
    return res.status(400).send(getApiValidationError("hasPaid", "string"));
  }
  if (req.body.chargeId && !validatePrimitive(req.body.chargeId, "string")) {
    return res.status(400).send(getApiValidationError("chargeId", "string"));
  }
  return next();
};
