import { Request, Response, NextFunction } from "express";
import { validateFormQuestion } from "./formQuestionValidators";
import {
  getApiValidationError,
  getImageTypeValidationError,
  getImageSizeValidationError,
  validateArray,
  validatePrimitive,
  validateDate,
  validateImageType,
  validateTime,
  validateImageSize,
} from "./util";
import { getErrorMessage } from "../../utilities/errorUtils";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const createCampDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let body;
  try {
    body = JSON.parse(req.body.body);
  } catch (e: unknown) {
    return res.status(400).send(getErrorMessage(e));
  }
  if (!validatePrimitive(body.name, "string")) {
    return res.status(400).send(getApiValidationError("name", "string"));
  }
  if (body.description && !validatePrimitive(body.description, "string")) {
    return res.status(400).send(getApiValidationError("description", "string"));
  }
  if (!validatePrimitive(body.location, "string")) {
    return res.status(400).send(getApiValidationError("location", "string"));
  }
  if (!validatePrimitive(body.ageLower, "integer")) {
    return res.status(400).send(getApiValidationError("ageLower", "integer"));
  }
  if (!validatePrimitive(body.ageUpper, "integer")) {
    return res.status(400).send(getApiValidationError("ageUpper", "integer"));
  }
  if (body.ageUpper < body.ageLower) {
    return res.status(400).send("ageUpper must be larger than ageLower");
  }
  if (!validatePrimitive(body.capacity, "integer")) {
    return res.status(400).send(getApiValidationError("capacity", "integer"));
  }
  if (!validatePrimitive(body.fee, "integer")) {
    return res.status(400).send(getApiValidationError("fee", "integer"));
  }

  if (
    body.formQuestions &&
    Array.isArray(body.formQuestions) &&
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    !body.formQuestions.every((formQuestion: { [key: string]: any }) => {
      return validateFormQuestion(formQuestion);
    })
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formQuestion", "string", true));
  }

  if (body.campSessions) {
    for (let i = 0; i < body.campSessions.length; i += 1) {
      const campSession = body.campSessions[i];
      if (campSession.dates && !validateArray(campSession.dates, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("dates", "string", true));
      }
      if (!campSession.dates.every(validateDate)) {
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
  if (body.campers) {
    return res.status(400).send("campers should be empty");
  }
  if (body.waitlist) {
    return res.status(400).send("waitlist should be empty");
  }
  if (req.file && !validateImageType(req.file.mimetype)) {
    return res.status(400).send(getImageTypeValidationError(req.file.mimetype));
  }
  if (req.file && !validateImageSize(req.file.size)) {
    return res.status(400).send(getImageSizeValidationError());
  }
  return next();
};
