import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

export const updateCamperDtoValidator = async (
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
  if (!validatePrimitive(req.body.parentName, "string")) {
    return res.status(400).send(getApiValidationError("parentName", "string"));
  }
  if (!validatePrimitive(req.body.contactEmail, "string")) {
    return res.status(400).send(getApiValidationError("contactEmail", "string"));
  }
  if (!validatePrimitive(req.body.contactNumber, "string")) {
    return res.status(400).send(getApiValidationError("contactNumber", "string"));
  }
  /* what to do for string[]? 
  if (!validatePrimitive(req.body.camps, "string[]")) {
    return res.status(400).send(getApiValidationError("camps", "string"));
  }*/
  if (!validatePrimitive(req.body.hasCamera, "boolean")) {
    return res.status(400).send(getApiValidationError("hasCamera", "boolean"));
  }
  if (!validatePrimitive(req.body.hasLaptop, "boolean")) {
    return res.status(400).send(getApiValidationError("hasLaptop", "boolean"));
  }
  if (!validatePrimitive(req.body.allergies, "string")) {
    return res.status(400).send(getApiValidationError("allergies", "string"));
  }
  if (!validatePrimitive(req.body.additionalDetails, "string")) {
    return res.status(400).send(getApiValidationError("additionalDetails", "string"));
  }
  /* what to do for these types? 
  if (!validatePrimitive(req.body.dropOffType, "DropOffType")) {
    return res.status(400).send(getApiValidationError("dropOffType", "DropOffType"));
  }
  if (!validatePrimitive(req.body.registrationDate, "Date")) {
    return res.status(400).send(getApiValidationError("registrationDate", "Date"));
  }*/
  if (!validatePrimitive(req.body.hasPaid, "boolean")) {
    return res.status(400).send(getApiValidationError("hasPaid", "boolean"));
  }
  if (!validatePrimitive(req.body.chargeId, "integer")) {
    return res.status(400).send(getApiValidationError("chargeId", "integer"));
  }
  return next();
};
