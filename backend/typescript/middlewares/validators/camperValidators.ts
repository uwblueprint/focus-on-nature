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
  let camp = "";
  if (req.body.length > 0) {
    camp = req.body[0].camp;
  }
  for (let i = 0; i < req.body.length; i += 1) {
    const camper = req.body[i];
    if (!validatePrimitive(camper.camp, "string")) {
      return res.status(400).send(getApiValidationError("camp", "string"));
    }
    if (camper.camp !== camp) {
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
    if (!validateDate(camper.registrationDate)) {
      return res
        .status(400)
        .send(getApiValidationError("registrationDate", "Date string"));
    }
    if (!validatePrimitive(camper.hasPaid, "boolean")) {
      return res.status(400).send(getApiValidationError("hasPaid", "boolean"));
    }
    if (!validatePrimitive(camper.chargeId, "string")) {
      return res.status(400).send(getApiValidationError("chargeId", "string"));
    }
  }
  return next();
};
