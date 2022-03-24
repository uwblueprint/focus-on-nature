import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validatePrimitive,
  validateDate,
  validateFormResponses,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const createCamperDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.campSession, "string")) {
    return res.status(400).send(getApiValidationError("campSession", "string"));
  }
  if (
    req.body.formResponses &&
    !validateFormResponses(req.body.formResponses, "string", "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formResponses", "mixed", true));
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
