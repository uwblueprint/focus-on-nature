import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validateArray,
  validatePrimitive,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const createCampDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.name, "string")) {
    return res.status(400).send(getApiValidationError("name", "string"));
  }
  if (
    req.body.description &&
    !validatePrimitive(req.body.description, "string")
  ) {
    return res.status(400).send(getApiValidationError("description", "string"));
  }
  if (!validatePrimitive(req.body.location, "string")) {
    return res.status(400).send(getApiValidationError("location", "string"));
  }
  if (!validatePrimitive(req.body.capacity, "integer")) {
    return res.status(400).send(getApiValidationError("capacity", "integer"));
  }
  if (!validatePrimitive(req.body.fee, "integer")) {
    return res.status(400).send(getApiValidationError("fee", "integer"));
  }
  if (req.body.camperInfo && !validateArray(req.body.camperInfo, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("camperInfo", "string", true));
  }
  if (!validateArray(req.body.camps, "string")) {
    return res.status(400).send(getApiValidationError("camps", "string", true));
  }
  if (req.body.campers && !validateArray(req.body.campers, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("campers", "string", true));
  }
  if (req.body.waitlist && !validateArray(req.body.waitlist, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("waitlist", "string", true));
  }
  if (!validatePrimitive(req.body.startDate, "string")) {
    return res.status(400).send(getApiValidationError("startDate", "string"));
  }
  if (!validatePrimitive(req.body.endDate, "string")) {
    return res.status(400).send(getApiValidationError("endDate", "string"));
  }
  if (!validatePrimitive(req.body.active, "boolean")) {
    return res.status(400).send(getApiValidationError("active", "boolean"));
  }
  return next();
};
