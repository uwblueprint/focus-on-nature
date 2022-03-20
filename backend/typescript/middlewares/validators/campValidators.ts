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
    console.log(req.body);
    body = JSON.parse(req.body.body);
  } catch (e: unknown) {
    console.log(e);
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
    !body.formQuestions.every((formQuestion: any) => {
      return validateFormQuestion(formQuestion);
    })
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formQuestion", "string", true));
  }

  if (body.dates && !validateArray(body.dates, "string")) {
    return res.status(400).send(getApiValidationError("dates", "string", true));
  }
  if (
    !body.dates.every((date: string) => {
      if (!validateDate(date)) return false;
      return true;
    })
  ) {
    return res.status(400).send(getApiValidationError("dates", "Date string"));
  }

  if (!validatePrimitive(body.startTime, "string")) {
    return res.status(400).send(getApiValidationError("startTime", "string"));
  }
  if (!validateTime(body.startTime)) {
    return res
      .status(400)
      .send(getApiValidationError("startTime", "24 hr time string"));
  }

  if (!validatePrimitive(body.endTime, "string")) {
    return res.status(400).send(getApiValidationError("endTime", "string"));
  }
  if (!validateTime(body.endTime)) {
    return res
      .status(400)
      .send(getApiValidationError("endTime", "24 hr time string"));
  }

  if (!validatePrimitive(body.active, "boolean")) {
    return res.status(400).send(getApiValidationError("active", "boolean"));
  }
  // camps field is filled in automatically
  if (body.camps) {
    return res.status(400).send("camps should be null");
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
    return res.status(400).send(getImageSizeValidationError(req.file.size));
  }
  return next();
};
