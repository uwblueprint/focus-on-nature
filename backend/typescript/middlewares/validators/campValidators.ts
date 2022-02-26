import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validateArray,
  validatePrimitive,
  validateDate,
  validateTime,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
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
  if (req.body.dates && !validateArray(req.body.dates, "string")) {
    return res.status(400).send(getApiValidationError("dates", "string", true));
  } else {
    for (var date of req.body.dates) {
      if (!validateDate(date))
        return res
          .status(400)
          .send(getApiValidationError("dates", "Date string"));
    }
  }
  if (!validatePrimitive(req.body.startTime, "string")) {
    return res.status(400).send(getApiValidationError("startTime", "string"));
  } else {
    if (!validateTime(req.body.startTime))
      return res
        .status(400)
        .send(getApiValidationError("startTime", "24 hr time string"));
  }
  if (!validatePrimitive(req.body.endTime, "string")) {
    return res.status(400).send(getApiValidationError("endTime", "string"));
  } else {
    if (!validateTime(req.body.endTime))
      return res
        .status(400)
        .send(getApiValidationError("endTime", "24 hr time string"));
  }
  if (!validatePrimitive(req.body.active, "boolean")) {
    return res.status(400).send(getApiValidationError("active", "boolean"));
  }
  // camps field is filled in automatically
  if (req.body.camps) {
    return res.status(400).send("camps should be null");
  }
  if (req.body.campers) {
    return res.status(400).send("campers should be empty");
  }
  if (req.body.waitlist) {
    return res.status(400).send("waitlist should be empty");
  }
  return next();
};
