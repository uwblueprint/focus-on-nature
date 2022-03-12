import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validatePrimitive,
  validateDate,
  validateFormResponses,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const updateCamperDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.camp && !validatePrimitive(req.body.camp, "string")) {
    return res.status(400).send(getApiValidationError("camp", "string"));
  }
  if (
    req.body.formResponses &&
    !validateFormResponses(req.body.formResponses, "string", "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formResponses", "mixed", true));
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
