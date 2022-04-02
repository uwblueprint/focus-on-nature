import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validatePrimitive,
  validateDate,
  validateMap,
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
    !validateMap(req.body.formResponses, "string", "string")
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
  if (!validatePrimitive(req.body.chargeId, "string")) {
    return res.status(400).send(getApiValidationError("chargeId", "string"));
  }

  return next();
};

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
    !validateMap(req.body.formResponses, "string", "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formResponses", "mixed", true));
  }
  if (req.body.hasPaid && !validatePrimitive(req.body.hasPaid, "boolean")) {
    return res.status(400).send(getApiValidationError("hasPaid", "boolean"));
  }
  return next();
};
