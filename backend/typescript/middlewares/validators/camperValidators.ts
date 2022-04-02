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
  let campSession = "";
  let chargeId = "";
  if (req.body.length > 0) {
    campSession = req.body[0].campSession;
    chargeId = req.body[0].chargeId;
  }
  if (req.body.camp && !validatePrimitive(req.body.camp, "string")) {
    return res.status(400).send(getApiValidationError("camp", "string"));
  }

  for (let i = 0; i < req.body.length; i += 1) {
    const camper = req.body[i];
    if (!validatePrimitive(camper.campSession, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("campSession", "string"));
    }
    if (camper.campSession !== campSession) {
      return res.status(400).send("Campers must have the same camp.");
    }
    if (
      camper.formResponses &&
      !validateMap(camper.formResponses, "string", "string")
    ) {
      return res
        .status(400)
        .send(getApiValidationError("formResponses", "mixed", true));
    }
    if (Object.keys(camper.formResponses).length === 0) {
      return res.status(400).send("formResponses should not be empty.");
    }
    if (!validatePrimitive(camper.hasPaid, "boolean")) {
      return res.status(400).send(getApiValidationError("hasPaid", "boolean"));
    }
    if (!validatePrimitive(camper.chargeId, "string")) {
      return res.status(400).send(getApiValidationError("chargeId", "string"));
    }
    if (camper.chargeId !== chargeId) {
      return res.status(400).send("Campers must have the same chargeId.");
    }
  }
  return next();
};
