import { Request, Response, NextFunction } from "express";
import { validateFormQuestion } from "./formQuestionValidators";
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
  if (!validatePrimitive(req.body.ageLower, "integer")) {
    return res.status(400).send(getApiValidationError("ageLower", "integer"));
  }
  if (!validatePrimitive(req.body.ageUpper, "integer")) {
    return res.status(400).send(getApiValidationError("ageUpper", "integer"));
  }
  if (req.body.ageUpper < req.body.ageLower) {
    return res.status(400).send("ageUpper must be larger than ageLower");
  }
  if (!validatePrimitive(req.body.capacity, "integer")) {
    return res.status(400).send(getApiValidationError("capacity", "integer"));
  }
  if (!validatePrimitive(req.body.fee, "integer")) {
    return res.status(400).send(getApiValidationError("fee", "integer"));
  }

  if (
    req.body.formQuestions &&
    Array.isArray(req.body.formQuestions) &&
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    !req.body.formQuestions.every((formQuestion: { [key: string]: any }) => {
      return validateFormQuestion(formQuestion);
    })
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formQuestion", "string", true));
  }

  if (req.body.campSessions) {
    for (let i = 0; i < req.body.campSessions.length; i += 1) {
      const campSession = req.body.campSessions[i];
      if (campSession.dates && !validateArray(campSession.dates, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("dates", "string", true));
      }
      if (
        !campSession.dates.every((date: string) => {
          if (!validateDate(date)) return false;
          return true;
        })
      ) {
        return res
          .status(400)
          .send(getApiValidationError("dates", "Date string"));
      }
      if (!validatePrimitive(campSession.startTime, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("startTime", "string"));
      }
      if (!validateTime(campSession.startTime)) {
        return res
          .status(400)
          .send(getApiValidationError("startTime", "24 hr time string"));
      }
      if (!validatePrimitive(campSession.endTime, "string")) {
        return res.status(400).send(getApiValidationError("endTime", "string"));
      }
      if (!validateTime(campSession.endTime)) {
        return res
          .status(400)
          .send(getApiValidationError("endTime", "24 hr time string"));
      }
      if (!validatePrimitive(campSession.active, "boolean")) {
        return res.status(400).send(getApiValidationError("active", "boolean"));
      }
    }
  }
  if (req.body.campers) {
    return res.status(400).send("campers should be empty");
  }
  if (req.body.waitlist) {
    return res.status(400).send("waitlist should be empty");
  }
  return next();
};
